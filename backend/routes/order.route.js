import express from "express";
import { deleteOrder, updateOrder, createOrder, getOrders, getOrdersByAccount,checkout } from '../controllers/order.controller.js';
const router = express.Router();

//
//  ENDPOINTS
//
router.get("/", getOrders);
router.get("/account/:accountId", getOrdersByAccount);
router.post("/checkout", checkout);
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

export default router;