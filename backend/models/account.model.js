const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({

    username: {
        type: String,
        unique: true,
        sparse: true
    },

    password: {
        type: String
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
        default: ""
    },

    address: {
        type: String,
        default: ""
    },

    googleId: {
        type: String,
        unique: true,
        sparse: true
    },

    authProvider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    }

}, { timestamps: true });

module.exports = mongoose.model("Account", accountSchema);