require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDB = require("./config/db");
const app = express();
app.disable("x-powered-by");
const origins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((value) => value.trim());
app.use(cors({ origin: origins, credentials: true }));
app.use((req, res, next) => {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  });
  if (["POST", "PATCH", "PUT", "DELETE"].includes(req.method)) {
    if (
      (req.get("sec-fetch-site") === "cross-site" && !req.get("origin")) ||
      (req.get("origin") && !origins.includes(req.get("origin")))
    )
      return res
        .status(403)
        .json({ message: "Request origin is not allowed." });
  }
  next();
});
app.use(express.json({ limit: "32kb" }));
app.use((req, res, next) => {
  req.body ||= {};
  next();
});
app.use(cookieParser());
app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "uploads"), { dotfiles: "deny" }),
);
const attempts = new Map();
const cleanup = setInterval(() => {
  for (const [key, value] of attempts)
    if (value.until < Date.now()) attempts.delete(key);
}, 60000);
cleanup.unref();
app.use("/api/auth", (req, res, next) => {
  if (req.method !== "POST") return next();
  const key = req.ip;
  const now = Date.now();
  let entry = attempts.get(key);
  if (!entry || entry.until < now) {
    entry = { count: 0, until: now + 15 * 60000 };
    attempts.set(key, entry);
  }
  if (++entry.count > 40) {
    res.set("Retry-After", String(Math.ceil((entry.until - now) / 1000)));
    return res
      .status(429)
      .json({ message: "Too many attempts. Please try again in 15 minutes." });
  }
  next();
});
app.get("/api/health", (req, res) => {
  const ready = require("mongoose").connection.readyState === 1;
  res
    .status(ready ? 200 : 503)
    .json({ status: ready ? "ok" : "database-unavailable" });
});
app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch {
    res
      .status(503)
      .json({ message: "Database unavailable. Please try again shortly." });
  }
});
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/sell", require("./routes/sellRoutes"));
app.use("/api/inquiries", require("./routes/inquiryRoutes"));
app.use("/api", require("./routes/predictPrice"));
app.use((req, res) => res.status(404).json({ message: "Route not found." }));
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const status =
    error.status ||
    (error.name === "MulterError" || error.message.startsWith("Use JPG")
      ? 400
      : 500);
  if (status >= 500) console.error("API error:", error.name);
  res.status(status).json({
    message:
      status < 500 ? error.message : "Something went wrong. Please try again.",
  });
});
if (require.main === module) {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)
    throw new Error("Set JWT_SECRET to at least 32 random characters.");
  connectDB()
    .then(() =>
      app.listen(process.env.PORT || 3000, () =>
        console.log("CarLo API ready"),
      ),
    )
    .catch(() => {
      console.error("Could not connect to MongoDB. Check MONGODB_URI.");
      process.exitCode = 1;
    });
}
module.exports = app;
