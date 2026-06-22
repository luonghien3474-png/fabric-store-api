import Account from '../models/account.model.js';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export const getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({});
        res.status(200).json({ success: true, data: accounts });
    } catch (error) {
        console.error("Error fetching accounts:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const createAccount = async (req, res) => {
    const {
        username,
        password,
        email,
        name,
        phoneNumber,
        address
    } = req.body;

    if (
        !username ||
        !password ||
        !email ||
        !name ||
        !phoneNumber ||
        !address
    ) {
        return res.status(400).json({
            success: false,
            message: "Missing fields"
        });
    }

    try {
        const existingUsername = await Account.findOne({ username });

        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: "Username already taken"
            });
        }

        const existingEmail = await Account.findOne({ email });

        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "Email already in use"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAccount = new Account({
            username,
            password: hashedPassword,
            email,
            name,
            phoneNumber,
            address
        });

        await newAccount.save();

        res.status(201).json({
            success: true,
            data: newAccount
        });
    } catch (error) {
        console.error("Error creating account:", error.message);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

export const updateAccount = async (req, res) => {
    const { id } = req.params;

    let {
        username,
        password,
        email,
        name,
        phoneNumber,
        address
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid Account Id"
        });
    }

    try {
        let updateFields = {
            username,
            email,
            name,
            phoneNumber,
            address
        };

        if (password) {
            updateFields.password = await bcrypt.hash(password, 10);
        }

        const updatedAccount = await Account.findByIdAndUpdate(
            id,
            updateFields,
            { new: true }
        );

        if (!updatedAccount) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }

        res.status(200).json({
            success: true,
            data: updatedAccount
        });
    } catch (error) {
        console.error("Error updating account:", error.message);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

export const deleteAccount = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid Account Id"
        });
    }

    try {
        const deletedAccount = await Account.findByIdAndDelete(id);

        if (!deletedAccount) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Account deleted"
        });
    } catch (error) {
        console.error("Error deleting account:", error.message);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};