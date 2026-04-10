import express from 'express';
import { registerUser, loginUser, forgotPassword, googleAuth } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/google', googleAuth);
authRouter.post('/forgot-password', forgotPassword);

export default authRouter;