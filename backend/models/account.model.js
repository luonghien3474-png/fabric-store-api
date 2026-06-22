import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type:String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
});

const Account = mongoose.model('Account', accountSchema);

export default Account;