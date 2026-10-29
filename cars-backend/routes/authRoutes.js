const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { randomBytes, createHash } = require("crypto");
const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:
    process.env.COOKIE_SAME_SITE === "none" &&
    process.env.NODE_ENV === "production"
      ? "none"
      : "lax",
  path: "/",
});
const publicUser = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
});
function session(res, user) {
  const token = jwt.sign(
    { version: user.sessionVersion },
    process.env.JWT_SECRET,
    { subject: user.id, expiresIn: "7d", algorithm: "HS256" },
  );
  res.cookie("token", token, { ...cookieOptions(), maxAge: 7 * 86400000 });
}
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (
    typeof username !== "string" ||
    username.trim().length < 2 ||
    username.trim().length > 60 ||
    typeof email !== "string" ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    typeof password !== "string" ||
    password.length < 10 ||
    Buffer.byteLength(password) > 72
  ) {
    return res
      .status(400)
      .json({
        message:
          "Enter a name, valid email, and a password of at least 10 characters (maximum 72 bytes).",
      });
  }
  try {
    const user = await User.create({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: await bcrypt.hash(password, 12),
    });
    session(res, user);
    res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    if (error.code === 11000)
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    throw error;
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    Buffer.byteLength(password) > 72
  )
    return res.status(400).json({ message: "Enter your email and password." });
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select(
    "+password",
  );
  const valid = await bcrypt.compare(
    password,
    user?.password ||
      "$2b$12$000000000000000000000uG9T1YgH/rhl5WJdl6yRJJeoa1NKQWOe",
  );
  if (!user || !valid)
    return res.status(401).json({ message: "Email or password is incorrect." });
  session(res, user);
  res.json({ user: publicUser(user) });
});
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (typeof email !== "string" || email.length > 254)
    return res.status(400).json({ message: "Enter a valid email address." });
  if (
    !process.env.RESEND_API_KEY ||
    !process.env.EMAIL_FROM ||
    !process.env.APP_URL
  )
    return res
      .status(503)
      .json({
        message:
          "Password recovery email is not configured. Please contact the site administrator.",
      });
  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (user) {
    const token = randomBytes(32).toString("hex");
    const hash = createHash("sha256").update(token).digest("hex");
    await User.updateOne(
      { _id: user.id },
      {
        $set: {
          resetTokenHash: hash,
          resetTokenExpires: new Date(Date.now() + 30 * 60000),
        },
      },
    );
    try {
      const link = new URL("/reset-password", process.env.APP_URL);
      link.hash = "token=" + token;
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        signal: AbortSignal.timeout(10000),
        headers: {
          Authorization: "Bearer " + process.env.RESEND_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject: "Reset your CarLo password",
          text:
            "Use this link within 30 minutes to reset your password: " +
            link.toString() +
            "\nIf you did not request this, ignore this email.",
        }),
      });
      if (!response.ok) throw new Error("Mail unavailable");
    } catch {
      await User.updateOne(
        { _id: user.id, resetTokenHash: hash },
        { $unset: { resetTokenHash: 1, resetTokenExpires: 1 } },
      );
      return res
        .status(503)
        .json({
          message:
            "Password recovery is temporarily unavailable. Please try again later.",
        });
    }
  }
  res.json({
    message:
      "If an account exists for this email, you will receive a password reset link.",
  });
});
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  if (
    typeof token !== "string" ||
    !/^[a-f0-9]{64}$/.test(token) ||
    typeof password !== "string" ||
    password.length < 10 ||
    Buffer.byteLength(password) > 72
  )
    return res
      .status(400)
      .json({
        message:
          "Use a valid reset link and a password of at least 10 characters (maximum 72 bytes).",
      });
  const resetTokenHash = createHash("sha256").update(token).digest("hex");
  const user = await User.findOneAndUpdate(
    { resetTokenHash, resetTokenExpires: { $gt: new Date() } },
    {
      $set: { password: await bcrypt.hash(password, 12) },
      $inc: { sessionVersion: 1 },
      $unset: { resetTokenHash: 1, resetTokenExpires: 1 },
    },
    { new: true },
  );
  if (!user)
    return res
      .status(400)
      .json({
        message:
          "This reset link is invalid or expired. Please request a new one.",
      });
  res.clearCookie("token", cookieOptions());
  res.json({ message: "Password reset. Sign in with your new password." });
});
router.get("/me", auth, (req, res) => res.json({ user: publicUser(req.user) }));
router.post("/logout", auth, async (req, res) => {
  await User.updateOne({ _id: req.user.id }, { $inc: { sessionVersion: 1 } });
  res.clearCookie("token", cookieOptions());
  res.json({ message: "Signed out." });
});
router.post("/password", auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (
    typeof currentPassword !== "string" ||
    typeof newPassword !== "string" ||
    newPassword.length < 10 ||
    Buffer.byteLength(newPassword) > 72 ||
    Buffer.byteLength(currentPassword) > 72
  )
    return res
      .status(400)
      .json({
        message:
          "Use a new password of at least 10 characters (maximum 72 bytes).",
      });
  const user = await User.findById(req.user.id).select("+password");
  if (!(await bcrypt.compare(currentPassword, user.password)))
    return res.status(400).json({ message: "Current password is incorrect." });
  user.password = await bcrypt.hash(newPassword, 12);
  user.sessionVersion += 1;
  await user.save();
  session(res, user);
  res.json({
    message: "Password updated. Other sessions have been signed out.",
  });
});
module.exports = router;
