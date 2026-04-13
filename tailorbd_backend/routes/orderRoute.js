import express from 'express';
import { 
    placeOrder, 
    getMyOrders, 
    getTailorOrders, 
    getAllOrders, 
    updateOrderStatus, 
    updatePaymentStatus 
} from '../controllers/orderController.js';
import { protect, adminOnly, tailorOnly } from '../middleware/authMiddleware.js';

const orderRouter = express.Router();

// Customer routes
orderRouter.post('/place', protect, placeOrder);
orderRouter.get('/mine', protect, getMyOrders);

// Tailor routes
orderRouter.get('/tailor', protect, tailorOnly, getTailorOrders);
orderRouter.patch('/status', protect, updateOrderStatus); // Tailors OR Admins (handled in controller)

// Admin routes
orderRouter.get('/all', protect, adminOnly, getAllOrders);
orderRouter.patch('/payment', protect, adminOnly, updatePaymentStatus);

export default orderRouter;
