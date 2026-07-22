import Account from "../models/account.model.js";
import Item from "../models/item.model.js";
import Record from "../models/record.model.js";
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

export const getOrdersByAccount = async (req, res) => {
    const { accountId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(accountId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid Account Id"
        });
    }

    try {
        const orders = await Order.find({ accountId })
            .populate("itemId");

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

        const newOrder = await Order.create({
            itemId,
            accountId
        });

        res.status(201).json({
            success: true,
            message: "Item added to cart.",
            data: newOrder
        });

    } catch (error) {

        // Duplicate accountId + itemId
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Item is already in your cart."
            });
        }

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

//checkout
export const checkout = async (req, res) => {
    const { accountId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(accountId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid Account Id"
        });
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // Get account
        const account = await Account.findById(accountId).session(session);

        if (!account) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }

        // Get all orders
        const orders = await Order.find({ accountId })
            .populate("itemId")
            .session(session);

        if (orders.length === 0) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "Cart is empty."
            });
        }

        // Make sure every item is still active
        for (const order of orders) {
            if (!order.itemId.active) {
                await session.abortTransaction();

                return res.status(409).json({
                    success: false,
                    message: `${order.itemId.name} is no longer available.`
                });
            }
        }

        // Atomically mark every item as inactive.
        // If even one fails, rollback.
        for (const order of orders) {

            const result = await Item.updateOne(
                {
                    _id: order.itemId._id,
                    active: true
                },
                {
                    $set: {
                        active: false
                    }
                },
                {
                    session
                }
            );

            if (result.modifiedCount !== 1) {
                throw new Error(
                    `${order.itemId.name} has already been purchased.`
                );
            }
        }

        // Save purchase record
        await Record.create(
            [{
                data: {
                    account,
                    items: orders.map(order => order.itemId)
                }
            }],
            {
                session
            }
        );

        // Empty the cart
        await Order.deleteMany(
            {
                accountId
            },
            {
                session
            }
        );

        await session.commitTransaction();

        res.status(200).json({
            success: true,
            message: "Checkout successful."
        });

    } catch (error) {

        await session.abortTransaction();

        console.error("Checkout error:", error.message);

        res.status(500).json({
            success: false,
            message: error.message
        });

    } finally {

        session.endSession();

    }
};