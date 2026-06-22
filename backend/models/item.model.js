import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    material: {
        type: String,
        required: true
    },
    imageURI: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true
});

const Item = mongoose.model('Item', itemSchema);

export default Item;