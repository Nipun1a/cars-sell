const express = require("express");
require("dotenv").config();
const cors = require("cors");

const connectDB = require("./config/db");

// Routes
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const sellRoutes = require("./routes/sellRoutes");
const predictPriceRoute = require("./routes/predictPrice");



const app = express();
connectDB();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/sell", sellRoutes);
app.use("/api", predictPriceRoute);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
