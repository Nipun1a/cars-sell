const router = require("express").Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const Sell = require("../models/Sell");
const Inquiry = require("../models/Inquiry");
router.use(auth);
router.get("/", async (req, res) => {
  res.json({
    inquiries: await Inquiry.find({ seller: req.user.id })
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("listing", "car_name")
      .populate("buyer", "username email")
      .lean(),
  });
});
router.post("/", async (req, res) => {
  const { listing, message } = req.body;
  if (
    !mongoose.isValidObjectId(listing) ||
    typeof message !== "string" ||
    message.trim().length < 10 ||
    message.length > 1000
  )
    return res
      .status(400)
      .json({
        message:
          "Choose a listing and write a message between 10 and 1,000 characters.",
      });
  const car = await Sell.findById(listing);
  if (!car)
    return res
      .status(404)
      .json({ message: "This listing is no longer available." });
  if (String(car.user) === req.user.id)
    return res.status(400).json({ message: "This is your own listing." });
  try {
    await Inquiry.create({
      listing,
      message: message.trim(),
      seller: car.user,
      buyer: req.user.id,
    });
    res.status(201).json({ message: "Enquiry saved." });
  } catch (error) {
    if (error.code === 11000)
      return res
        .status(409)
        .json({ message: "You have already sent an enquiry for this car." });
    throw error;
  }
});
module.exports = router;
