import TailorProfile from '../models/tailorProfileModel.js';

// GET Tailor Profile
export const getTailorProfile = async (req, res) => {
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

// CREATE or UPDATE Tailor Profile
export const updateTailorProfile = async (req, res) => {
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

// DELETE Tailor Profile
export const deleteTailorProfile = async (req, res) => {
    try {
        const { tailorId } = req.params;
        await TailorProfile.findOneAndDelete({ tailorId });
        res.status(200).json({ success: true, message: "Shop profile deleted successfully." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
