import express from "express";
import { deleteItem, updateItem, createItem, getItems } from '../controllers/item.controller.js';

const router = express.Router();

//
//  ENDPOINTS
//
router.get("/", getItems);
router.Item("/", createItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

export default router;