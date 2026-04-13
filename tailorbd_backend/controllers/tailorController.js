import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import { v2 as cloudinary } from 'cloudinary';

// 1. GET ALL PUBLIC TAILORS (Public)
export const getAllPublicTailors = async (req, res) => {
    try {
        const { search } = req.query;
        const filter = { role: 'tailor', isActive: true };

        if (search) {
            filter.fullName = { $regex: search, $options: 'i' };
        }

        const tailors = await User.find(filter)
            .select('fullName profileImage bio rating totalRatings createdAt')
            .sort({ rating: -1, createdAt: -1 });

        res.status(200).json({ success: true, tailors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. GET TAILOR PROFILE (Public — with their products)
export const getTailorProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const tailor = await User.findById(id)
            .select('fullName profileImage bio rating totalRatings phone email createdAt');

        if (!tailor || tailor.role === 'admin') {
            return res.status(404).json({ success: false, message: "Tailor not found." });
        }

        const products = await Product.find({ tailor: id }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, tailor, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. UPDATE TAILOR PROFILE (Tailor updates their own)
export const updateTailorProfile = async (req, res) => {
    try {
        const { bio, fullName, phone } = req.body;
        const updateData = {};

        if (bio !== undefined) updateData.bio = bio;
        if (fullName) updateData.fullName = fullName;
        if (phone) updateData.phone = phone;

        // Handle profile image upload
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'image' });
            updateData.profileImage = result.secure_url;
        }

        const updatedTailor = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true }
        ).select('-password');

        res.status(200).json({ success: true, message: "Profile updated.", tailor: updatedTailor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
