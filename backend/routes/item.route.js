import express from "express";
import { deleteItem, updateItem, createItem, getItems, getItem } from '../controllers/item.controller.js';

const router = express.Router();

//
//  ENDPOINTS
//
router.get("/", getItems);
router.get("/:id", getItem);
router.post("/", createItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

export default router;