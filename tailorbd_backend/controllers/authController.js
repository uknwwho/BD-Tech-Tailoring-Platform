import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

// 1. REGISTER USER
export const registerUser = async (req, res) => {
    try {
        const { fullName, email, password, phone } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already in use." });
        }

        // ENCRYPT THE PASSWORD
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save the user with the scrambled password
        const newUser = new User({
            fullName,
            email,
            phone,
            password: hashedPassword // Secure!
        });

        await newUser.save();

        // Create a login token
        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ success: true, token, user: { id: newUser._id, name: newUser.fullName, role: newUser.role } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. LOGIN USER
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // COMPARE THE PASSWORDS
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials." });
        }

        // Generate Token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ success: true, token, user: { id: user._id, name: user.fullName, role: user.role } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. FORGOT PASSWORD (Developer Mock Version)
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "No account with that email exists." });
        }

        // Create a temporary 15-minute token
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

        // DEV TRICK: Print the link to the terminal instead of sending a real email
        const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
        console.log("\n=============================================");
        console.log(`🔒 PASSWORD RESET LINK FOR ${email}:`);
        console.log(resetLink);
        console.log("=============================================\n");

        res.status(200).json({ success: true, message: "Password reset link sent to your email (Check VS Code Terminal!)." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Initialize Google Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
    try {
        const { token } = req.body; // The token sent from React

        // Verify the token with Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name } = payload; // Google gives us their email and name

        // Check if they already exist in our DB
        let user = await User.findOne({ email });

        if (!user) {
            // If they are new, create an account for them!
            const salt = await bcrypt.genSalt(10);
            const randomPassword = await bcrypt.hash(Date.now().toString(), salt);

            user = new User({
                fullName: name,
                email,
                password: randomPassword,
                phone: "Google Auth - Update Required", // Because your DB requires a phone!
                role: email.includes('@admin.com') ? 'admin' : (email.includes('@tailor.com') ? 'tailor' : 'customer')
            });
            await user.save();
        }

        // Generate our standard JWT Token so the app treats them like a normal user
        const jwtToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ success: true, token: jwtToken, user: { id: user._id, name: user.fullName, role: user.role } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};