import User from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateToken } from "../config/token.js";

// ======================================================
// Register User
// ======================================================
export const registeration = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        const trimmedName = name.trim();
        const trimmedEmail = email.trim().toLowerCase();

        if (!validator.isEmail(trimmedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        const existingUser = await User.findOne({
            email: trimmedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: trimmedName,
            email: trimmedEmail,
            password: hashedPassword
        });

        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60
        });

        return res.status(201).json({
            success: true,
            message: "Registration Successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// ======================================================
// Login
// ======================================================
export const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required"
            });
        }

        const trimmedEmail = email.trim().toLowerCase();

        if (!validator.isEmail(trimmedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email"
            });
        }

        const user = await User.findOne({
            email: trimmedEmail
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60
        });

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// ======================================================
// Logout
// ======================================================
export const logout = (req, res) => {

    try {

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        return res.status(200).json({
            success: true,
            message: "Logout Successful"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// ======================================================
// Google Login
// ======================================================
export const googleLogin = async (req, res) => {

    console.log(req.body);

    try {

        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and Email are required"
            });
        }

        const trimmedName = name.trim();
        const trimmedEmail = email.trim().toLowerCase();

        if (!validator.isEmail(trimmedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email"
            });
        }

        // Check if user already exists
        let user = await User.findOne({
            email: trimmedEmail
        });

        // If user doesn't exist, create one
        if (!user) {

            // Random password because Google users don't use it
            const randomPassword = crypto.randomBytes(32).toString("hex");

            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            user = await User.create({
                name: trimmedName,
                email: trimmedEmail,
                password: hashedPassword
            });
        }

        // Generate JWT
        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60
        });

        return res.status(200).json({
            success: true,
            message: "Google Login Successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};