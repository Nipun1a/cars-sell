const mongoose = require("mongoose");
module.exports = mongoose.model(
  "Sell",
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },
      car_name: { type: String, required: true, trim: true, maxlength: 120 },
      model: { type: Number, required: true, min: 1980 },
      price: { type: Number, required: true, min: 10000, max: 100000000 },
      kms_driven: { type: Number, required: true, min: 0, max: 2000000 },
      fuel_type: {
        type: String,
        enum: ["Petrol", "Diesel", "CNG", "LPG", "Electric"],
        required: true,
      },
      transmission: {
        type: String,
        enum: ["Manual", "Automatic"],
        required: true,
      },
      city: { type: String, required: true, maxlength: 80 },
      photos: { type: [String], default: [] },
      description: { type: String, maxlength: 2000 },
    },
    { timestamps: true },
  ),
);
