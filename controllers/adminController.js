import dotenv from "dotenv";
dotenv.config();

import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// Admin Signup
export const adminSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "Admin registered successfully!" });
  } catch (err) {
    console.error("❌ Admin Signup Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required!" });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ error: "Admin not found!" });
    }

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password!" });
    }

    const token = jwt.sign({ adminId: admin._id }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      token,
      admin: { _id: admin._id, name: admin.name, email: admin.email },
      message: "Admin login successful!",
    });
  } catch (err) {
    console.error("❌ Admin Login Error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Admin Logout
export const adminLogout = (req, res) => {
  res.status(200).json({ message: "Admin logged out successfully!" });
};
