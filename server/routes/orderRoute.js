import express from "express";
import {
  addOrderItem,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getAllOrders,
} from "../controllers/orderController.js";
import { protect } from "../middlewares/authMiddleware.js";
import fetch from "node-fetch";
import axios from "axios";

const router = express.Router();

//getUserOrder
router.route("/myorders").get(protect, getMyOrders);
//get order by id
router.route("/:id").get(protect, getOrderById);
//craete new order
router.route("/").post(protect, addOrderItem);
//update order
router.route("/:id/pay").put(protect, updateOrderToPaid);
//get all orders
router.route("/").get(getAllOrders);
export default router;

// PayPal Credentials (Store these in .env)
// const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
// const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
// const PAYPAL_API = "https://api-m.sandbox.paypal.com"; // Sandbox URL
const PAYPAL_API = "https://api-m.sandbox.paypal.com"; // Sandbox URL

const PAYPAL_CLIENT_ID =
  "ASbAHxY9Jj8tAEX5NZFJzz9ChAa9vWMzez9TsLGmp7JcnzXdGV6oMqazrZtsvbuNlGbZwWQ5oWJKcjBu";
const PAYPAL_CLIENT_SECRET =
  "EHo80TFnI-3lP3VUqWMK7PSraFPlQQnj06foyUJ27tO0JO8MPULNTGYjSYd8yB9sUrxOrnqGa-6NIL2m";
// Generate PayPal Access Token
const generateAccessToken = async () => {
  try {
    const auth = Buffer.from(
      `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("Missing PayPal Client ID or Secret");
    }
    console.log("Auth Header:", auth); // Debugging

    const response = await axios.post(
      `${PAYPAL_API}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error("PayPal API Error:", error.response?.data || error.message);
  }
};

// Create Order
router.post("/paypal/create-order", async (req, res) => {
  const accessToken = await generateAccessToken();
  const { amount } = req.body;
  const orderData = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: amount,
        },
      },
    ],
  };

  const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  const order = await response.json();
  res.json(order); // Return order ID to frontend
});

// Capture Payment (After User Approves)
router.post("/paypal/capture-order", async (req, res) => {
  const { orderID } = req.body;
  const accessToken = await generateAccessToken();

  const response = await fetch(
    `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  const captureData = await response.json();
  res.json(captureData);
});
