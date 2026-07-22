import Record from '../models/record.model.js';
import mongoose from 'mongoose';

export const getRecords = async (req, res) => {
    try {
        const records = await Record.find({});
        res.status(200).json({ success: true, data: records });
    } catch (error) {
        console.error("Error fetching records:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const createRecord = async (req, res) => {
    const { data } = req.body;

    if (!data) {
        return res.status(400).json({
            success: false,
            message: "Missing data field"
        });
    }

    const newRecord = new Record({ data });

    try {
        await newRecord.save();
        res.status(201).json({
            success: true,
            data: newRecord
        });
    } catch (error) {
        console.error("Error creating record:", error.message);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

export const updateRecord = async (req, res) => {
    const { id } = req.params;
    const record = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            success: false,
            message: "Invalid Record Id"
        });
    }

    try {
        const updatedRecord = await Record.findByIdAndUpdate(
            id,
            record,
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: updatedRecord
        });
    } catch (error) {
        console.error("Error updating record:", error.message);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

export const deleteRecord = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            success: false,
            message: "Invalid Record Id"
        });
    }

    try {
        await Record.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Record deleted"
        });
    } catch (error) {
        console.error("Error deleting record:", error.message);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};