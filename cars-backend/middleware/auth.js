const jwt = require("jsonwebtoken");
const User = require("../models/User");
module.exports = async function auth(req, res, next) {
  let decoded;
  try {
    decoded = jwt.verify(req.cookies?.token || "", process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
  } catch {
    return res.status(401).json({ message: "Please sign in to continue." });
  }
  const user = await User.findById(decoded.sub);
  if (!user || user.sessionVersion !== decoded.version) {
    return res.status(401).json({ message: "Please sign in to continue." });
  }
  req.user = user;
  next();
};
