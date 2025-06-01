import dotenv from "dotenv";  
dotenv.config();  // Load env vars first

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";  
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || !MONGO_URI) {
  console.error("❌ JWT_SECRET or MONGO_URI is undefined! Check your .env file.");
  process.exit(1);
}

// ✅ MIDDLEWARE first
app.use(express.json());
const allowedOrigins = ['https://balance-bite-front-sfjc.vercel.app'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Must come BEFORE routes
app.options('*', cors()); // Handle preflight
// ✅ ROUTES after middleware
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes); // This should be AFTER app.use(express.json())
app.use("/api/admin", adminRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Healthcare Store Backend is Running!");
});

// DB connection and server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
