import Order from '../models/order.model.js';
import mongoose from 'mongoose';

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('accountId')
            .populate('itemId');

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error("Error fetching orders:", error.message);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

export const createOrder = async (req, res) => {
    const { itemId, accountId } = req.body;

    if (!itemId || !accountId) {
        return res.status(400).json({
            success: false,
            message: "Missing fields"
        });
    }

    try {
        const newOrder = new Order({
            itemId,
            accountId
        });

        await newOrder.save();

        res.status(201).json({
            success: true,
            data: newOrder
        });
    } catch (error) {
        console.error("Error creating order:", error.message);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

export const updateOrder = async (req, res) => {
    const { id } = req.params;
    const { itemId, accountId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid Order Id"
        });
    }

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            {
                itemId,
                accountId
            },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            data: updatedOrder
        });
    } catch (error) {
        console.error("Error updating order:", error.message);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

export const deleteOrder = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid Order Id"
        });
    }

    try {
        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Order deleted"
        });
    } catch (error) {
        console.error("Error deleting order:", error.message);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};