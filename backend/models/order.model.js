import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    }
},{
    timestamps: true 
});

const Order = mongoose.model('Order', orderSchema);

export default Order;


