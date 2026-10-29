const router = require("express").Router();
const auth = require("../middleware/auth");
const Valuation = require("../models/Valuation");
const base = () =>
  (process.env.ML_API_URL || "http://127.0.0.1:5000").replace(/\/$/, "");
async function ml(path, options = {}) {
  const response = await fetch(base() + path, {
    ...options,
    signal: AbortSignal.timeout(20000),
  });
  const body = await response.json();
  return { response, body };
}
router.get("/valuation-options", async (req, res) => {
  try {
    const { response, body } = await ml("/options");
    res.status(response.status).json(body);
  } catch {
    res
      .status(503)
      .json({
        message: "Valuation service is unavailable. Please try again shortly.",
      });
  }
});
router.get("/valuations", auth, async (req, res) => {
  res.json({
    valuations: await Valuation.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean(),
  });
});
router.post("/predict-price", auth, async (req, res) => {
  let result;
  try {
    const { response, body } = await ml("/predict-price", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    if (!response.ok)
      return res
        .status(response.status < 500 ? 400 : 503)
        .json({ message: body.message || "Valuation service is unavailable." });
    result = body;
    if (
      !Number.isFinite(result.predicted_price) ||
      !result.model_version ||
      !result.inputs
    )
      throw new Error("Invalid prediction response");
  } catch {
    return res
      .status(503)
      .json({
        message: "Valuation service is unavailable. Please try again shortly.",
      });
  }
  const saved = await Valuation.create({ user: req.user.id, ...result });
  res.status(201).json({ valuation: saved });
});
module.exports = router;
