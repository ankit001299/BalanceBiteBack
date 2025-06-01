import dotenv from "dotenv";
dotenv.config(); // ✅ Load env variables

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
console.log("JWT_SECRET (Auth Controller):", JWT_SECRET);

// ✅ Sign Up Logic
export const signup = async (req, res) => {
  try {
    console.log("🔹 Signup request received:", req.body);
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.log("❌ Missing required fields in signup");
      return res.status(400).json({ error: "All fields are required!" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`❌ User already exists: ${email}`);
      return res.status(400).json({ error: "User already exists!" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({ name, email, password: hashedPassword });

    console.log("✅ User registered successfully:", user);

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("❌ Signup Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// ✅ Login Logic
export const login = async (req, res) => {
  try {
    console.log("🔹 Login request received:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("❌ Missing email or password");
      return res.status(400).json({ error: "Email and password are required!" });
    }

    console.log(`🔍 Searching for user with email: ${email}`);
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`❌ User not found: ${email}`);
      return res.status(400).json({ error: "User not found!" });
    }

    console.log("🔹 Found user:", user);

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log("❌ Invalid password attempt");
      return res.status(400).json({ error: "Invalid password!" });
    }

    console.log("✅ Password verified");

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

    console.log("✅ Token generated successfully");

    res.status(200).json({
      token,
      user: { _id: user._id, name: user.name, email: user.email },
      message: "Login successful!",
    });
  } catch (err) {
    console.error("❌ Login Error:", err.message || err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// ✅ Logout Logic
export const logout = (req, res) => {
  res.status(200).json({ message: "Logged out successfully!" });
};
