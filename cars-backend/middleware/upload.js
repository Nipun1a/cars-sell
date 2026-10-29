const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { randomUUID } = require("crypto");
const directory = path.resolve(__dirname, "../uploads");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(directory, { recursive: true });
    cb(null, directory);
  },
  filename: (req, file, cb) =>
    cb(
      null,
      randomUUID() +
        { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" }[
          file.mimetype
        ],
    ),
});
module.exports = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 5, fields: 12 },
  fileFilter: (req, file, cb) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype))
      return cb(new Error("Use JPG, PNG, or WebP images."));
    cb(null, true);
  },
});
