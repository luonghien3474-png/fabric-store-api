import express from "express";
import { deleteOrder, updateOrder, createOrder, getOrders } from '../controllers/order.controller.js';

const router = express.Router();

//
//  ENDPOINTS
//
router.get("/", getOrders);
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

export default router;