const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');

const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(bodyParser.json());

// Routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
