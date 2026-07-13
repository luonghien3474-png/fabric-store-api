import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import Account from "../models/account.model.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function signup(req, res) {
    try {
        const {
            username,
            password,
            email,
            name,
            phoneNumber,
            address
        } = req.body;

        const existingEmail = await Account.findOne({ email });

        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "Email already exists."
            });
        }

        if (username) {
            const existingUsername = await Account.findOne({ username });

            if (existingUsername) {
                return res.status(400).json({
                    success: false,
                    message: "Username already exists."
                });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const account = await Account.create({
            username,
            password: hashedPassword,
            email,
            name,
            phoneNumber,
            address,
            authProvider: "local"
        });

        const token = jwt.sign(
            {
                accountId: account._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(201).json({
            success: true,
            token,
            account
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
}

export async function login(req, res) {

    try {

        const { email, password } = req.body;

        const account = await Account.findOne({ email });

        if (!account) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        if (account.authProvider === "google") {
            return res.status(400).json({
                success: false,
                message: "Please sign in with Google."
            });
        }

        const validPassword = await bcrypt.compare(
            password,
            account.password
        );

        if (!validPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const token = jwt.sign(
            {
                accountId: account._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            success: true,
            token,
            account
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

}

export async function googleLogin(req, res) {

    try {

        const { token } = req.body;

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        if (!payload.email_verified) {
            return res.status(400).json({
                success: false,
                message: "Google email is not verified."
            });
        }

        let account = await Account.findOne({
            email: payload.email
        });

        if (!account) {

            account = await Account.create({

                email: payload.email,
                name: payload.name,
                phoneNumber: "",
                address: "",
                googleId: payload.sub,
                authProvider: "google"

            });

        } else if (account.authProvider === "local") {

            return res.status(400).json({
                success: false,
                message: "Please sign in using your password."
            });

        }

        if (!account.googleId) {
            account.googleId = payload.sub;
            await account.save();
        }

        const jwtToken = jwt.sign(
            {
                accountId: account._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            success: true,
            token: jwtToken,
            account
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

}

export async function getAccounts(req, res) {

    try {

        const accounts = await Account.find().select("-password");

        res.json({
            success: true,
            accounts
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

}

export async function getAccount(req, res) {

    try {

        const account = await Account.findById(req.params.id).select("-password");

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found."
            });
        }

        res.json({
            success: true,
            account
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

}

export async function updateAccount(req, res) {

    try {

        const account = await Account.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true
            }
        ).select("-password");

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found."
            });
        }

        res.json({
            success: true,
            account
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

}

export async function deleteAccount(req, res) {

    try {

        const account = await Account.findByIdAndDelete(req.params.id);

        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found."
            });
        }

        res.json({
            success: true,
            message: "Account deleted."
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

}