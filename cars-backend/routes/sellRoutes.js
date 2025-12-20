const express = require("express");
const router = express.Router();
const Sell = require("../models/sell");

// Create selling page (Add car for sale)
router.post("/sell", async (req, res) => {
  try {
    const { car_name, model, price, photos, description } = req.body;

    // Validation
    if (!car_name || !model || !price || !photos) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    // Create new sell entry
    const newSell = new Sell({
      car_name,
      model,
      price,
      photos,
      description,
    });

    await newSell.save();

    // Success response
    return res.status(201).json({
      success: true,
      message: "Car listed for sale successfully",
      data: newSell,
    });

  } catch (error) {
    console.error("Error saving selling form:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while saving car details",
    });
  }
});

module.exports = router;
