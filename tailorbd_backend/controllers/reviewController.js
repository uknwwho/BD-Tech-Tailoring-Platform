import Review from '../models/reviewModel.js';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';

// Helper: Recalculate a tailor's aggregate rating from all active reviews
const recalculateTailorRating = async (tailorId) => {
    const activeReviews = await Review.find({ tailor: tailorId, status: 'active' });
    if (activeReviews.length === 0) {
        await User.findByIdAndUpdate(tailorId, { rating: 0, totalRatings: 0 });
    } else {
        const sum = activeReviews.reduce((acc, r) => acc + r.rating, 0);
        const avg = parseFloat((sum / activeReviews.length).toFixed(1));
        await User.findByIdAndUpdate(tailorId, { rating: avg, totalRatings: activeReviews.length });
    }
};

// =============================================
// CUSTOMER ENDPOINTS
// =============================================

// POST /api/reviews — Submit a new review
export const createReview = async (req, res) => {
    try {
        const { orderId, rating, comment } = req.body;
        const customerId = req.user._id;

        // 1. Validate the order exists and belongs to this customer
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }
        if (order.customer.toString() !== customerId.toString()) {
            return res.status(403).json({ success: false, message: "You can only review your own orders." });
        }
        if (order.status !== 'Delivered') {
            return res.status(400).json({ success: false, message: "You can only review delivered orders." });
        }

        // 2. Check if already reviewed
        const existing = await Review.findOne({ order: orderId });
        if (existing) {
            return res.status(400).json({ success: false, message: "You have already reviewed this order." });
        }

        // 3. Create the review
        const review = new Review({
            customer: customerId,
            tailor: order.tailor,
            order: orderId,
            rating,
            comment
        });
        await review.save();

        // 4. Recalculate tailor's rating
        await recalculateTailorRating(order.tailor);

        res.status(201).json({ success: true, message: "Review submitted!", review });
    } catch (error) {
        console.error("Create review error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/reviews/my — Get all reviews by logged-in customer
export const getMyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ customer: req.user._id })
            .populate('tailor', 'fullName profileImage')
            .populate('order', '_id status')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/reviews/:id — Edit own review
export const updateReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found." });
        }
        if (review.customer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "You can only edit your own reviews." });
        }

        const { rating, comment } = req.body;
        if (rating) review.rating = rating;
        if (comment) review.comment = comment;
        review.status = 'active'; // Reset any flags on edit
        await review.save();

        await recalculateTailorRating(review.tailor);

        res.status(200).json({ success: true, message: "Review updated!", review });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/reviews/:id — Delete own review
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found." });
        }
        if (review.customer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "You can only delete your own reviews." });
        }

        const tailorId = review.tailor;
        await Review.findByIdAndDelete(req.params.id);
        await recalculateTailorRating(tailorId);

        res.status(200).json({ success: true, message: "Review deleted." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// =============================================
// PUBLIC ENDPOINTS
// =============================================

// GET /api/reviews/tailor/:tailorId — Get all active reviews for a tailor
export const getTailorReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ tailor: req.params.tailorId, status: 'active' })
            .populate('customer', 'fullName')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/reviews/order/:orderId — Check if a review exists for a specific order
export const getReviewByOrder = async (req, res) => {
    try {
        const review = await Review.findOne({ order: req.params.orderId })
            .populate('customer', 'fullName');
        res.status(200).json({ success: true, review }); // review may be null
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// =============================================
// ADMIN ENDPOINTS
// =============================================

// GET /api/reviews/admin/all — Get all reviews (all statuses)
export const getAllReviewsAdmin = async (req, res) => {
    try {
        const reviews = await Review.find({})
            .populate('customer', 'fullName email')
            .populate('tailor', 'fullName email')
            .populate('order', '_id status totalAmount')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PATCH /api/reviews/admin/:id/status — Change review moderation status
export const updateReviewStatus = async (req, res) => {
    try {
        const { status, adminNote } = req.body;
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found." });
        }

        if (!['active', 'flagged', 'hidden'].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status. Use: active, flagged, hidden." });
        }

        review.status = status;
        if (adminNote !== undefined) review.adminNote = adminNote;
        await review.save();

        // Recalculate since hiding/showing reviews affects the average
        await recalculateTailorRating(review.tailor);

        res.status(200).json({ success: true, message: `Review status changed to '${status}'.`, review });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/reviews/admin/:id — Force-delete any review
export const adminDeleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found." });
        }

        const tailorId = review.tailor;
        await Review.findByIdAndDelete(req.params.id);
        await recalculateTailorRating(tailorId);

        res.status(200).json({ success: true, message: "Review permanently deleted." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
