import express from "express";
import {
    deleteAccount,
    updateAccount,
    createAccount,
    getAccounts
} from '../controllers/account.controller.js';

import Account from '../models/account.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

//
// CRUD ENDPOINTS
//
router.get("/", getAccounts);
router.post("/", createAccount);
router.put("/:id", updateAccount);
router.delete("/:id", deleteAccount);

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables.");
    process.exit(1);
}

//
// SIGNUP
//
router.post('/signup', async (req, res) => {
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
            message: "Account created",
            account: {
                id: newAccount._id,
                username: newAccount.username,
                email: newAccount.email
            }
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

//
// LOGIN
//
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const account = await Account.findOne({ username });

        if (!account) {
            return res.status(400).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            account.password
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const token = jwt.sign(
            { id: account._id },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            success: true,
            token,
            account: {
                id: account._id,
                username: account.username,
                email: account.email,
                name: account.name
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

export default router;