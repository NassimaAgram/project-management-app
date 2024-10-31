import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
import otpGenerator from 'otp-generator';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    },
    port: 465,
    host: 'smtp.gmail.com'
});

// Utility function to send emails
const sendEmail = (emailData, res, next) => {
    transporter.sendMail(emailData, (err) => {
        if (err) {
            return next(err);
        }
        res.status(200).json({ message: "OTP sent" });
    });
};

// Function to create and send verification email
const createEmailTemplate = (email, name, reason, otp) => {
    const subject = reason === "FORGOTPASSWORD" 
        ? 'VEXA Reset Password Verification' 
        : 'Account Verification OTP';

    const content = `
        <div style="font-family: Poppins, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDHQMmI5x5qWbOrEuJuFWkSIBQoT_fFyoKOKYqOSoIvQ&s" alt="VEXA Logo" style="display: block; margin: 0 auto; max-width: 200px; margin-bottom: 20px;">
            <h1 style="font-size: 22px; font-weight: 500; color: #854CE6; text-align: center; margin-bottom: 30px;">${subject}</h1>
            <div style="background-color: #FFF; border: 1px solid #e5e5e5; border-radius: 5px; box-shadow: 0px 3px 6px rgba(0,0,0,0.05);">
                <div style="background-color: #854CE6; border-top-left-radius: 5px; border-top-right-radius: 5px; padding: 20px 0;">
                    <h2 style="font-size: 28px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 10px;">Verification Code</h2>
                    <h1 style="font-size: 32px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 20px;">${otp}</h1>
                </div>
                <div style="padding: 30px;">
                    <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Dear ${name},</p>
                    <p style="font-size: 14px; color: #666; margin-bottom: 20px;">${reason === "FORGOTPASSWORD" ? "To reset your VEXA account password, please enter the following verification code:" : "Thank you for creating a VEXA account. To activate your account, please enter the following verification code:"}</p>
                    <p style="font-size: 20px; font-weight: 500; color: #666; text-align: center; margin-bottom: 30px; color: #854CE6;">${otp}</p>
                    <p style="font-size: 12px; color: #666; margin-bottom: 20px;">If you did not create a VEXA account or request a password reset, please disregard this email.</p>
                </div>
            </div>
            <br>
            <p style="font-size: 16px; color: #666; margin-bottom: 20px; text-align: center;">Best regards,<br>The VEXA Team</p>
        </div>
    `;
    
    return {
        to: email,
        subject,
        html: content
    };
}

export const signup = async (req, res, next) => {
    const { email, password } = req.body;

    // Check for email and password
    if (!email || !password) {
        return res.status(422).json({ message: "Missing email or password." });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email is already in use." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt); // Use await here
        const newUser = new User({ ...req.body, password: hashedPassword });

        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT, { expiresIn: "1h" });
        return res.status(200).json({ token, user: newUser }); // Make sure to return here
    } catch (err) {
        return next(err); // Return the next to propagate the error
    }
};

export const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return next(createError(404, "User not found"));
        }
        
        if (user.googleSignIn) {
            return next(createError(403, "Sign in with Google account instead."));
        }

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return next(createError(401, "Incorrect password"));
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: "1h" });
        res.status(200).json({ token, user });
    } catch (err) {
        next(err);
    }
};

export const googleAuthSignIn = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            const newUser = new User({ ...req.body, googleSignIn: true });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT, { expiresIn: "1h" });
            return res.status(200).json({ token, user: newUser });
        } 
        
        if (user.googleSignIn) {
            const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: "1h" });
            return res.status(200).json({ token, user });
        } 
        
        return next(createError(403, "Email is already associated with a standard account. Please sign in normally."));
    } catch (err) {
        next(err);
    }
};

export const logout = (req, res) => {
    res.clearCookie("access_token").json({ message: "Logged out" });
};

export const generateOTP = async (req, res, next) => {
    const { email, name, reason } = req.query;
    
    // Generate OTP and store in `req.app.locals`
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false, digits: true });
    req.app.locals.OTP = otp;

    // Create email data
    const emailData = createEmailTemplate(email, name, reason, otp);

    // Use Promise-based version for `sendEmail`
    transporter.sendMail(emailData, (err) => {
        if (err) {
            req.app.locals.OTP = null; // Clear OTP if there’s an error
            return next(err);
        }
        return res.status(200).json({ message: "OTP sent" });
    });
};


export const verifyOTP = async (req, res, next) => {
    const { code } = req.query;
    if (parseInt(code) === parseInt(req.app.locals.OTP)) {
        req.app.locals.OTP = null; // Clear OTP after verification
        req.app.locals.resetSession = true;
        return res.status(200).json({ message: "OTP verified" });
    }
    return next(createError(401, "Incorrect OTP"));
};

export const createResetSession = (req, res) => {
    if (req.app.locals.resetSession) {
        req.app.locals.resetSession = false; // Reset the session flag
        return res.status(200).json({ message: "Access granted" });
    }
    return res.status(400).json({ message: "Session expired" });
};

export const findUserByEmail = async (req, res, next) => {
    const { email } = req.query;
    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(200).json({ message: "User found" });
        }
        return res.status(404).json({ message: "User not found" });
    } catch (err) {
        next(err);
    }
};

export const resetPassword = async (req, res, next) => {
    if (!req.app.locals.resetSession) return res.status(440).json({ message: "Session expired" });

    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        await User.updateOne({ email }, { $set: { password: hashedPassword } });

        req.app.locals.resetSession = false; // Reset session flag
        return res.status(200).json({ message: "Password reset successful" });

    } catch (err) {
        next(err);
    }
};