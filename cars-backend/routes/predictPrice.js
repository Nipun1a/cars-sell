const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/predict-price", async (req, res) => {
  try {
    const carData = req.body;

    // Call Flask ML API
    const response = await axios.post(
      "http://127.0.0.1:5000/predict-price",
      carData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      predicted_price: response.data.predicted_price,
    });

  } catch (error) {
    console.error("ML API error:", error.message);

    res.status(500).json({
      error: "Price prediction failed",
    });
  }
});

module.exports = router;
