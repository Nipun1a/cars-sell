const mongoose = require("mongoose");
module.exports = mongoose.model(
  "Inquiry",
  new mongoose.Schema(
    {
      listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sell",
        required: true,
      },
      seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },
      buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      message: { type: String, required: true, minlength: 10, maxlength: 1000 },
    },
    { timestamps: true },
  ).index({ listing: 1, buyer: 1 }, { unique: true }),
);
