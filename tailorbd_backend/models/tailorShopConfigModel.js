import mongoose from "mongoose";

const tailorProfileSchema = new mongoose.Schema({
    // Links this profile directly to the logged-in user
    tailorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

    shopName: { type: String, required: true },
    description: { type: String },

    // Array of strings (e.g., ["Dhaka", "Chittagong", "Sylhet"])
    serviceAreas: [{ type: String }],

    // Dynamic Pricing Array
    pricing: [{
        category: { type: String, required: true }, // e.g., "Suit", "Panjabi", "Lehenga"
        basePrice: { type: Number, required: true },
        turnaroundTime: { type: String, required: true } // e.g., "7 days"
    }]
}, { timestamps: true });

const TailorProfile = mongoose.models.TailorProfile || mongoose.model('TailorProfile', tailorProfileSchema);
export default TailorProfile;