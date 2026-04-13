import express from 'express';
import { getAllPublicTailors, getTailorProfile, updateTailorProfile } from '../controllers/tailorController.js';
import { protect, tailorOnly } from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';

const tailorRouter = express.Router();

// Tailor-only route (MUST come before /:id)
tailorRouter.put('/profile', protect, tailorOnly, upload.single('profileImage'), updateTailorProfile);

// Public routes
tailorRouter.get('/', getAllPublicTailors);
tailorRouter.get('/:id', getTailorProfile);

export default tailorRouter;
