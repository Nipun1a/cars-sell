const mongoose = require("mongoose");
module.exports = mongoose.model(
  "Valuation",
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },
      inputs: { type: mongoose.Schema.Types.Mixed, required: true },
      predicted_price: { type: Number, required: true, min: 0 },
      price_range: { lower: Number, upper: Number },
      model_version: { type: String, required: true },
      warnings: [String],
    },
    { timestamps: true },
  ),
);
