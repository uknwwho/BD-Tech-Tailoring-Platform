import express from 'express';
import { getTailorProfile, updateTailorProfile } from '../controllers/tailorController.js';

const tailorRouter = express.Router();

tailorRouter.get('/profile/:tailorId', getTailorProfile);
tailorRouter.post('/profile', updateTailorProfile);
tailorRouter.delete('/profile/:tailorId', deleteTailorProfile);

export default tailorRouter;