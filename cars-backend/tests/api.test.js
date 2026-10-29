const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { randomUUID } = require("node:crypto");
const fs = require("node:fs/promises");
const path = require("node:path");
// Tests only ever use a separate, randomly named local database.
process.env.MONGODB_URI =
  "mongodb://127.0.0.1:" +
  (process.env.TEST_MONGO_PORT || "27029") +
  "/carlo_test_" +
  randomUUID().replaceAll("-", "");
process.env.JWT_SECRET = "test-only-secret-" + randomUUID() + randomUUID();
process.env.FRONTEND_URL = "http://localhost:5173";
const mongoose = require("mongoose");
const app = require("../server");
const httpFetch = global.fetch;
let server, base;
const cookies = {};
async function request(method, route, body, who, headers = {}) {
  const multipart = body instanceof FormData;
  const response = await httpFetch(base + route, {
    method,
    headers: {
      ...(body && !multipart ? { "Content-Type": "application/json" } : {}),
      ...(who && cookies[who] ? { Cookie: cookies[who] } : {}),
      ...headers,
    },
    ...(body ? { body: multipart ? body : JSON.stringify(body) } : {}),
  });
  const cookie = response.headers.get("set-cookie");
  if (cookie && who) cookies[who] = cookie.split(";")[0];
  return { status: response.status, body: await response.json(), cookie };
}
const carInput = {
  name: "Maruti Swift Dzire VDI",
  year: 2014,
  kms_driven: 60000,
  fuel_type: "Diesel",
  transmission: "Manual",
  owner: "First Owner",
  seller_type: "Individual",
  engine: 1248,
  mileage: 23.4,
  max_power: 74,
  seats: 5,
};
before(async () => {
  await require("../config/db")();
  await Promise.all([
    require("../models/User").init(),
    require("../models/Inquiry").init(),
  ]);
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  base = "http://127.0.0.1:" + server.address().port + "/api";
});
after(async () => {
  // Remove only generated test uploads; never touch user uploads.
  if (mongoose.connection.readyState === 1) {
    const listings = await require("../models/Sell").find({});
    await Promise.allSettled(
      listings
        .flatMap((car) => car.photos)
        .map((photo) => fs.unlink(path.resolve(__dirname, "..", "." + photo))),
    );
    await mongoose.connection.dropDatabase();
  }
  await mongoose.disconnect();
  if (server) await new Promise((resolve) => server.close(resolve));
});
test("account, marketplace and ML persistence flows", async (t) => {
  let listing, valuation;
  await t.test(
    "reject unauthenticated valuation and listing creation",
    async () => {
      assert.equal(
        (await request("POST", "/predict-price", carInput)).status,
        401,
      );
      assert.equal((await request("POST", "/sell", {})).status, 401);
    },
  );
  await t.test("reject cross-origin state changes", async () => {
    assert.equal(
      (
        await request("POST", "/auth/register", {}, null, {
          Origin: "https://untrusted.example",
        })
      ).status,
      403,
    );
  });
  await t.test("validate signup and normalize email", async () => {
    assert.equal(
      (
        await request("POST", "/auth/register", {
          username: "x",
          email: "bad",
          password: "short",
        })
      ).status,
      400,
    );
    const result = await request(
      "POST",
      "/auth/register",
      {
        username: "Seller",
        email: "Seller@Example.test ",
        password: "safe-password-123",
      },
      "seller",
    );
    assert.equal(result.status, 201);
    assert.equal(result.body.user.email, "seller@example.test");
    assert.ok(!result.body.user.password);
    assert.match(result.cookie, /HttpOnly/);
    const stored = await require("../models/User")
      .findOne({ email: "seller@example.test" })
      .select("+password");
    assert.notEqual(stored.password, "safe-password-123");
  });
  await t.test("reject duplicate account and invalid login", async () => {
    assert.equal(
      (
        await request("POST", "/auth/register", {
          username: "Other",
          email: "seller@example.test",
          password: "safe-password-123",
        })
      ).status,
      409,
    );
    assert.equal(
      (
        await request("POST", "/auth/login", {
          email: "seller@example.test",
          password: "wrong-password",
        })
      ).status,
      401,
    );
    assert.equal(
      (
        await request("POST", "/auth/login", {
          email: { $ne: null },
          password: "safe-password-123",
        })
      ).status,
      400,
    );
  });
  await t.test("login restores a server-verified session", async () => {
    assert.equal(
      (
        await request(
          "POST",
          "/auth/login",
          { email: "SELLER@example.test", password: "safe-password-123" },
          "seller",
        )
      ).status,
      200,
    );
    assert.equal(
      (await request("GET", "/auth/me", null, "seller")).body.user.username,
      "Seller",
    );
  });
  await t.test(
    "options and invalid ML input return useful responses",
    async () => {
      const result = await request("GET", "/valuation-options");
      assert.equal(result.status, 200);
      assert.ok(result.body.models.length > 100);
      const invalid = await request(
        "POST",
        "/predict-price",
        { ...carInput, kms_driven: -1 },
        "seller",
      );
      assert.equal(invalid.status, 400);
    },
  );
  await t.test("real ML valuation is durably saved in INR", async () => {
    const result = await request("POST", "/predict-price", carInput, "seller");
    assert.equal(result.status, 201, JSON.stringify(result.body));
    valuation = result.body.valuation;
    assert.ok(valuation.predicted_price > 10000);
    assert.ok(valuation.price_range.lower < valuation.predicted_price);
    assert.ok(valuation.price_range.upper > valuation.predicted_price);
    const stored = await require("../models/Valuation").findById(valuation._id);
    assert.equal(stored.inputs.name, carInput.name);
    assert.equal(stored.model_version, valuation.model_version);
    const history = await request("GET", "/valuations", null, "seller");
    assert.equal(history.body.valuations[0]._id, valuation._id);
  });
  await t.test("reject spoofed upload signatures", async () => {
    const form = new FormData();
    Object.entries({
      car_name: "Honda City",
      model: "2017",
      price: "650000",
      kms_driven: "40000",
      fuel_type: "Petrol",
      transmission: "Manual",
      city: "Mumbai",
    }).forEach(([key, value]) => form.append(key, value));
    form.append(
      "photos",
      new Blob(["not an image"], { type: "image/png" }),
      "fake.png",
    );
    assert.equal((await request("POST", "/sell", form, "seller")).status, 400);
  });
  await t.test("create and read a database-backed listing", async () => {
    const form = new FormData();
    Object.entries({
      car_name: "Honda City",
      model: "2017",
      price: "650000",
      kms_driven: "40000",
      fuel_type: "Petrol",
      transmission: "Manual",
      city: "Mumbai",
      description: "Regularly serviced, first owner.",
    }).forEach(([key, value]) => form.append(key, value));
    form.append(
      "photos",
      new Blob(
        [
          await fs.readFile(
            path.resolve(__dirname, "../../cars/src/assets/car1.jpg"),
          ),
        ],
        { type: "image/jpeg" },
      ),
      "car.jpg",
    );
    const result = await request("POST", "/sell", form, "seller");
    assert.equal(result.status, 201, JSON.stringify(result.body));
    listing = result.body.car;
    const listings = await request("GET", "/sell?q=Honda&fuel=Petrol");
    assert.equal(listings.body.total, 1);
    assert.equal(listings.body.cars[0]._id, listing._id);
    assert.ok(!listings.body.cars[0].user);
    assert.equal((await request("GET", "/sell?q=%5B")).status, 200);
  });
  await t.test(
    "keep valuations and listing ownership private across accounts",
    async () => {
      await request(
        "POST",
        "/auth/register",
        {
          username: "Buyer",
          email: "buyer@example.test",
          password: "safe-password-123",
        },
        "buyer",
      );
      assert.equal(
        (await request("GET", "/valuations", null, "buyer")).body.valuations
          .length,
        0,
      );
      assert.equal(
        (await request("GET", "/sell/mine", null, "buyer")).body.cars.length,
        0,
      );
      assert.equal(
        (await request("DELETE", "/sell/" + listing._id, null, "buyer")).status,
        404,
      );
    },
  );
  await t.test(
    "buyer enquiry is stored, visible only to seller, and deduplicated",
    async () => {
      const input = {
        listing: listing._id,
        message: "Can I arrange a viewing this weekend?",
      };
      assert.equal(
        (await request("POST", "/inquiries", input, "buyer")).status,
        201,
      );
      assert.equal(
        (await request("POST", "/inquiries", input, "buyer")).status,
        409,
      );
      const inbox = await request("GET", "/inquiries", null, "seller");
      assert.equal(inbox.body.inquiries[0].buyer.email, "buyer@example.test");
      assert.equal(
        (await request("GET", "/inquiries", null, "buyer")).body.inquiries
          .length,
        0,
      );
    },
  );
  await t.test("changing password revokes old sessions", async () => {
    const oldCookie = cookies.seller;
    assert.equal(
      (
        await request(
          "POST",
          "/auth/password",
          { currentPassword: "wrong", newPassword: "changed-password-123" },
          "seller",
        )
      ).status,
      400,
    );
    assert.equal(
      (
        await request(
          "POST",
          "/auth/password",
          {
            currentPassword: "safe-password-123",
            newPassword: "changed-password-123",
          },
          "seller",
        )
      ).status,
      200,
    );
    assert.equal(
      (await request("GET", "/auth/me", null, null, { Cookie: oldCookie }))
        .status,
      401,
    );
    assert.equal(
      (await request("GET", "/auth/me", null, "seller")).status,
      200,
    );
  });
  await t.test("only owner can remove listing and uploaded photo", async () => {
    assert.equal(
      (await request("DELETE", "/sell/" + listing._id, null, "seller")).status,
      200,
    );
    assert.equal((await request("GET", "/sell")).body.total, 0);
    await assert.rejects(
      fs.access(path.resolve(__dirname, "..", "." + listing.photos[0])),
    );
  });
  await t.test("logout revokes cookie token server-side", async () => {
    const oldCookie = cookies.seller;
    assert.equal(
      (await request("POST", "/auth/logout", {}, "seller")).status,
      200,
    );
    assert.equal(
      (await request("GET", "/auth/me", null, null, { Cookie: oldCookie }))
        .status,
      401,
    );
  });
  await t.test(
    "failed ML service does not create a valuation record",
    async () => {
      const original = global.fetch;
      const count = await require("../models/Valuation").countDocuments();
      global.fetch = async () => {
        throw new Error("Simulated unavailable ML");
      };
      try {
        assert.equal(
          (await request("POST", "/predict-price", carInput, "buyer")).status,
          503,
        );
        assert.equal(
          await require("../models/Valuation").countDocuments(),
          count,
        );
      } finally {
        global.fetch = original;
      }
    },
  );
  await t.test(
    "email recovery stores hashed expiring token without sending real mail",
    async () => {
      const original = global.fetch;
      const previous = {
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        EMAIL_FROM: process.env.EMAIL_FROM,
        APP_URL: process.env.APP_URL,
      };
      process.env.RESEND_API_KEY = "test-key";
      process.env.EMAIL_FROM = "test@example.test";
      process.env.APP_URL = "http://localhost:5173";
      let mail;
      global.fetch = async (url, options) => {
        assert.equal(url, "https://api.resend.com/emails");
        mail = JSON.parse(options.body);
        return { ok: true };
      };
      try {
        const response = await request("POST", "/auth/forgot-password", {
          email: "buyer@example.test",
        });
        assert.equal(response.status, 200);
        const token = mail.text.match(/token=([a-f0-9]{64})/)[1];
        const stored = await require("../models/User")
          .findOne({ email: "buyer@example.test" })
          .select("+resetTokenHash +resetTokenExpires");
        assert.notEqual(stored.resetTokenHash, token);
        assert.ok(stored.resetTokenExpires > new Date());
        assert.equal(
          (
            await request("POST", "/auth/reset-password", {
              token,
              password: "recovered-password-123",
            })
          ).status,
          200,
        );
        assert.equal(
          (await request("GET", "/auth/me", null, "buyer")).status,
          401,
        );
        assert.equal(
          (
            await request("POST", "/auth/reset-password", {
              token,
              password: "recovered-password-123",
            })
          ).status,
          400,
        );
        assert.equal(
          (
            await request(
              "POST",
              "/auth/login",
              {
                email: "buyer@example.test",
                password: "recovered-password-123",
              },
              "buyer",
            )
          ).status,
          200,
        );
      } finally {
        global.fetch = original;
        for (const [key, value] of Object.entries(previous)) {
          if (value === undefined) delete process.env[key];
          else process.env[key] = value;
        }
      }
    },
  );
});
