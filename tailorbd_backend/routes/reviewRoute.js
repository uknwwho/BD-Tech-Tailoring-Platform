import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import {
    createReview,
    getMyReviews,
    updateReview,
    deleteReview,
    getTailorReviews,
    getReviewByOrder,
    getAllReviewsAdmin,
    updateReviewStatus,
    adminDeleteReview
} from '../controllers/reviewController.js';

const reviewRouter = express.Router();

// Customer routes (protected)
reviewRouter.post('/', protect, createReview);
reviewRouter.get('/my', protect, getMyReviews);
reviewRouter.put('/:id', protect, updateReview);
reviewRouter.delete('/:id', protect, deleteReview);

// Public routes
reviewRouter.get('/tailor/:tailorId', getTailorReviews);
reviewRouter.get('/order/:orderId', getReviewByOrder);

// Admin routes (protected + admin only)
reviewRouter.get('/admin/all', protect, adminOnly, getAllReviewsAdmin);
reviewRouter.patch('/admin/:id/status', protect, adminOnly, updateReviewStatus);
reviewRouter.delete('/admin/:id', protect, adminOnly, adminDeleteReview);

export default reviewRouter;
