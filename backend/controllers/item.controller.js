import Item from '../models/item.model.js';
import mongoose from 'mongoose';
export const getItems = async (req, res) => {
    try {
        const now = new Date();

        // Reactivate items that have been inactive for 24+ hours
        await Item.updateMany(
            {
                active: false,
                updatedAt: {
                    $lte: new Date(now.getTime() - 24 * 60 * 60 * 1000)
                }
            },
            {
                $set: {
                    active: true
                }
            }
        );

        // Only return available items
        const items = await Item.find({
            active: true
        });

        res.status(200).json({
            success: true,
            data: items
        });

    } catch (error) {
        console.error("Error fetching items:", error.message);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};
export const getItem = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid Item Id"
        });
    }

    try {
        const item = await Item.findById(id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        res.status(200).json({
            success: true,
            data: item
        });
    } catch (error) {
        console.error("Error fetching item:", error.message);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};
export const createItem = async (req, res) => {
    const {
        name,
        price,
        size,
        material,
        imageURI,
        active
    } = req.body;

    if (
        !name ||
        price === undefined ||
        !size ||
        !material ||
        !imageURI ||
        active === undefined
    ) {
        return res.status(400).json({
            success: false,
            message: "Missing fields"
        });
    }

    try {
        const newItem = new Item({
            name,
            price,
            size,
            material,
            imageURI,
            active
        });

        await newItem.save();

        res.status(201).json({
            success: true,
            data: newItem
        });
    } catch (error) {
        console.error("Error creating item:", error.message);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

export const updateItem = async (req, res) => {
    const { id } = req.params;
    const {
        name,
        price,
        size,
        material,
        imageURI,
        active
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid Item Id"
        });
    }

    try {
        const updatedItem = await Item.findByIdAndUpdate(
            id,
            {
                name,
                price,
                size,
                material,
                imageURI,
                active
            },
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        res.status(200).json({
            success: true,
            data: updatedItem
        });
    } catch (error) {
        console.error("Error updating item:", error.message);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

export const deleteItem = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid Item Id"
        });
    }

    try {
        const deletedItem = await Item.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Item deleted"
        });
    } catch (error) {
        console.error("Error deleting item:", error.message);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};