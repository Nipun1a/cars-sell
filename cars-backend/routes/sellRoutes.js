const express = require("express");
const router = express.Router();
const Sell = require("../models/sell");
const multer = require("multer");
const path = require("path");

// multer config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// POST /api/sell
router.post("/", upload.array("photos", 5), async (req, res) => {
  try {
    const { car_name, model, price, description } = req.body;

    if (!car_name || !model || !price || !req.files.length) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const photos = req.files.map(f => f.path);

    const car = new Sell({
      car_name,
      model,
      price,
      description,
      photos,
    });

    await car.save();

    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
