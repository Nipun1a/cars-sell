const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
const User = require('../models/User');

// Protected route — Get logged-in user's info
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        // Fetch full user info from DB
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "Protected route working",
            user: user
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching user profile" });
    }
});

module.exports = router;
