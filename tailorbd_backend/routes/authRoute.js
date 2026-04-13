import express from 'express';
import { registerUser, loginUser, forgotPassword, adminCreateUser, getAllTailors, getAllUsers, toggleUserStatus, deleteUser, googleAuth } from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/google', googleAuth);
authRouter.post('/forgot-password', forgotPassword);

// Admin Routes
authRouter.post('/admin/create-user', protect, adminOnly, adminCreateUser);
authRouter.get('/admin/tailors', protect, adminOnly, getAllTailors);
authRouter.get('/admin/users', protect, adminOnly, getAllUsers);
authRouter.patch('/admin/toggle-status/:id', protect, adminOnly, toggleUserStatus);
authRouter.delete('/admin/delete-user/:id', protect, adminOnly, deleteUser);

export default authRouter;