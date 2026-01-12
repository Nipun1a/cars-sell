const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./config/db");

// Routes
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const sellRoutes = require("./routes/sellRoutes");
const predictPriceRoute = require("./routes/predictPrice");

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/sell", sellRoutes);
app.use("/api", predictPriceRoute);

// Health check route (optional but useful)
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Start server only after DB connects
const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB", err);
    process.exit(1);
  });
