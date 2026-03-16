import Banner from '../models/cmsBannerModel.js';
import Promotion from '../models/cmsPromotionModel.js';

// BANNER


// POST
export const addBanner = async (req, res) => {
    try {
        const { title, image, active } = req.body;
        // Note: Later, when you use your config/cloudinary.js, 'image' will be the secure_url from Cloudinary
        const newBanner = new Banner({ title, image, active });
        await newBanner.save();
        res.status(201).json({ success: true, message: "Banner added successfully", banner: newBanner });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET
export const getBanners = async (req, res) => {
    try {
        const banners = await Banner.find({}).sort({ createdAt: -1 }); // Newest first
        res.status(200).json({ success: true, banners });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// UPDATE
export const toggleBannerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { active } = req.body;

        const updatedBanner = await Banner.findByIdAndUpdate(
            id,
            { active },
            { new: true }
        );
        res.status(200).json({ success: true, message: "Banner status updated", banner: updatedBanner });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete
export const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        await Banner.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Banner deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// PROMOTION


// POST
export const addPromotion = async (req, res) => {
    try {
        const { name, code, discountPercentage, validUntil, status } = req.body;
        const newPromo = new Promotion({ name, code, discountPercentage, validUntil, status });
        await newPromo.save();
        res.status(201).json({ success: true, message: "Promotion added successfully", promotion: newPromo });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET
export const getPromotions = async (req, res) => {
    try {
        const promotions = await Promotion.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, promotions });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE
export const deletePromotion = async (req, res) => {
    try {
        const { id } = req.params;
        await Promotion.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Promotion deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// UPDATE
export const updatePromotionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Expecting 'Active' or 'Expired'

        const updatedPromo = await Promotion.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        res.status(200).json({ success: true, message: "Promotion status updated", promotion: updatedPromo });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};