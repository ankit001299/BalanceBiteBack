import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Robust way to extract token
  console.log("📦 Received token:", token);

  if (!token) {
    console.log("❌ No token provided");
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("🔐 User decoded:", decoded);
    next();
  } catch (err) {
    console.log("❌ Invalid token", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};

