import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    active: { type: Boolean, default: true }
}, { timestamps: true }); // Mongoose automatically adds `createdAt` which acts as your uploadDate


const Banner = mongoose.models.Banner || mongoose.model('Banner', bannerSchema);
export default Banner;
