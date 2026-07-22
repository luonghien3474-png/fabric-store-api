import express from "express";
import {
    deleteRecord,
    updateRecord,
    createRecord,
    getRecords
} from "../controllers/record.controller.js";

const router = express.Router();

//
// ENDPOINTS
//
router.get("/", getRecords);
router.post("/", createRecord);
router.put("/:id", updateRecord);
router.delete("/:id", deleteRecord);

export default router;