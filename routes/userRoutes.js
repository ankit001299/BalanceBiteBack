import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import User from '../models/userModel.js';

const router = express.Router();

// GET /api/profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
