import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
            required: true
        },
        accountId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account",
            required: true
        }
    },
    {
        timestamps: true
    }
);

// Prevent duplicate cart entries for the same user and item
orderSchema.index(
    {
        accountId: 1,
        itemId: 1
    },
    {
        unique: true
    }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;