const router = require("express").Router();
const fs = require("fs/promises");
const path = require("path");
const mongoose = require("mongoose");
const Sell = require("../models/Sell");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
router.get("/", async (req, res) => {
  const filter = { user: { $type: "objectId" } };
  if (typeof req.query.q === "string" && req.query.q.trim())
    filter.car_name = {
      $regex: req.query.q.slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      $options: "i",
    };
  if (["Petrol", "Diesel", "CNG", "LPG", "Electric"].includes(req.query.fuel))
    filter.fuel_type = req.query.fuel;
  const page = Math.max(1, Math.min(10000, parseInt(req.query.page) || 1));
  const sort =
    req.query.sort === "price_asc"
      ? { price: 1 }
      : req.query.sort === "price_desc"
        ? { price: -1 }
        : { createdAt: -1 };
  const [cars, total] = await Promise.all([
    Sell.find(filter)
      .select("-user")
      .sort(sort)
      .skip((page - 1) * 12)
      .limit(12)
      .lean(),
    Sell.countDocuments(filter),
  ]);
  res.json({ cars, total, page, pages: Math.ceil(total / 12) });
});
router.get("/mine", auth, async (req, res) =>
  res.json({
    cars: await Sell.find({ user: req.user.id }).sort({ createdAt: -1 }).lean(),
  }),
);
router.post(
  "/",
  auth,
  (req, res, next) => {
    if (process.env.VERCEL)
      return res.status(503).json({
        message:
          "Image storage requires a persistent server volume. Configure hosting before creating listings.",
      });
    upload.array("photos", 5)(req, res, next);
  },
  async (req, res) => {
    try {
      const {
        car_name,
        model,
        price,
        kms_driven,
        fuel_type,
        transmission,
        city,
        description,
      } = req.body;
      if (
        !Number.isInteger(Number(model)) ||
        Number(model) > new Date().getFullYear() ||
        !req.files?.length ||
        !car_name?.trim() ||
        !city?.trim()
      )
        throw new Error("Enter all vehicle details and at least one photo.");
      for (const file of req.files) {
        const bytes = await fs.readFile(file.path);
        const valid =
          (file.mimetype === "image/jpeg" &&
            bytes[0] === 255 &&
            bytes[1] === 216 &&
            bytes[2] === 255) ||
          (file.mimetype === "image/png" &&
            bytes
              .subarray(0, 8)
              .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) ||
          (file.mimetype === "image/webp" &&
            bytes.toString("ascii", 0, 4) === "RIFF" &&
            bytes.toString("ascii", 8, 12) === "WEBP");
        if (!valid)
          throw new Error(
            "One of the photos is not a valid JPG, PNG, or WebP image.",
          );
      }
      const car = await Sell.create({
        user: req.user.id,
        car_name,
        model,
        price,
        kms_driven,
        fuel_type,
        transmission,
        city,
        description,
        photos: req.files.map((file) => "/uploads/" + path.basename(file.path)),
      });
      res.status(201).json({ car });
    } catch (error) {
      await Promise.allSettled(
        (req.files || []).map((file) => fs.unlink(file.path)),
      );
      if (
        error.name === "ValidationError" ||
        error.name === "CastError" ||
        error.message.startsWith("Enter ") ||
        error.message.startsWith("One of")
      )
        return res.status(400).json({ message: error.message });
      throw error;
    }
  },
);
router.delete("/:id", auth, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).json({ message: "Invalid listing." });
  const car = await Sell.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });
  if (!car) return res.status(404).json({ message: "Listing not found." });
  await Promise.allSettled(
    car.photos
      .filter((photo) => /^\/uploads\/[\w-]+\.(jpg|png|webp)$/.test(photo))
      .map((photo) => fs.unlink(path.resolve(__dirname, "..", "." + photo))),
  );
  res.json({ message: "Listing removed." });
});
module.exports = router;
