import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tailor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true }, // 1 review per order
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    status: {
        type: String,
        enum: ['active', 'flagged', 'hidden'],
        default: 'active'
    },
    adminNote: { type: String, default: '' }
}, { timestamps: true });

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export default Review;
