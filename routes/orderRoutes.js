// import express from "express";
// import { saveOrder } from "../controllers/orderController.js";
// import { verifyToken } from "../middleware/authMiddleware.js";
// import { getUserOrders } from "../controllers/orderController.js";


// const router = express.Router();

// console.log("📦 Orders route loaded");

// router.post("/save", verifyToken, saveOrder); // Protect this route
// router.get("/my-orders", verifyToken, getUserOrders); // New route


// export default router;

// orderRoutes.js
import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getUserOrders, saveOrder } from "../controllers/orderController.js";

const router = express.Router();

router.post("/save", verifyToken, saveOrder);
router.get("/my-orders", verifyToken, getUserOrders); // ✅ This is the key route

export default router;
