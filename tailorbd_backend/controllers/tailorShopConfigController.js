import TailorProfile from '../models/tailorShopConfigModel.js';

// GET Tailor Shop Configuration Profile
export const getTailorShopConfigProfile = async (req, res) => {
    try {
        const { tailorId } = req.params;
        const profile = await TailorProfile.findOne({ tailorId });

        // It's okay if it's null, it just means they haven't set it up yet
        res.status(200).json({ success: true, profile });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// CREATE or UPDATE Tailor Shop Configuration Profile
export const updateTailorShopConfigProfile = async (req, res) => {
    try {
        const { tailorId, shopName, description, serviceAreas, pricing } = req.body;

        // Upsert looks for the tailorId. If found -> Updates. If not found -> Creates new.
        const updatedProfile = await TailorProfile.findOneAndUpdate(
            { tailorId },
            { shopName, description, serviceAreas, pricing },
            { new: true, upsert: true }
        );

        res.status(200).json({ success: true, message: "Shop configuration saved!", profile: updatedProfile });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE Tailor Shop Configuration Profile
export const deleteTailorShopConfigProfile = async (req, res) => {
    try {
        const { tailorId } = req.params;
        await TailorProfile.findOneAndDelete({ tailorId });
        res.status(200).json({ success: true, message: "Shop profile deleted successfully." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
