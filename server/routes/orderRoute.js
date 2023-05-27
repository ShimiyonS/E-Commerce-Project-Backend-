import express from "express";
import {
  addOrderItem,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
} from "../controllers/orderController.js";
import {protect} from "../middlewares/authMiddleware.js";
const router = express.Router();

//getUserOrder
router.route("/myorders").get(protect, getMyOrders);
//get order by id
router.route("/:id").get(protect, getOrderById);
//craete new order
router.route("/").post(protect, addOrderItem);
//update order
router.route("/:id/pay").put(protect, updateOrderToPaid);
export default router;
