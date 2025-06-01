import jwt from "jsonwebtoken";
import Order from "../models/Order.js";

export const saveOrder = async (req, res) => {
  try {
    console.log("🛬 saveOrder reached");
    console.log("🧾 Request body:", req.body);
    console.log("🔐 User from token:", req.user);

    const { items, totalPrice, address } = req.body;
    const userId = req.user?.userId || "000000000000000000000000"; // mock ObjectId for debug

    if (!items || !totalPrice || !address) {
      return res.status(400).json({ error: "Missing order details" });
    }

    const newOrder = new Order({ userId, items, totalPrice, address });
    await newOrder.save();

    console.log("✅ Order saved:", newOrder);
    res.status(201).json({ message: "Order saved successfully", order: newOrder });
  } catch (err) {
    console.error("❌ Error saving order:", err);
    res.status(500).json({ error: "Failed to save order", details: err.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.userId;  // Access the userId from req.user
    console.log("🔐 Fetching orders for user:", userId);  // Log userId

    const orders = await Order.find({ userId });
    if (orders.length === 0) {
      return res.status(404).json({ error: "No orders found" });
    }

    res.json(orders);
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders", details: err.message });
  }
};

