const mongoose = require("mongoose");
module.exports = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      username: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 60,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },
      password: { type: String, required: true, select: false },
      sessionVersion: { type: Number, default: 0 },
      resetTokenHash: { type: String, select: false },
      resetTokenExpires: { type: Date, select: false },
    },
    { timestamps: true },
  ),
);
