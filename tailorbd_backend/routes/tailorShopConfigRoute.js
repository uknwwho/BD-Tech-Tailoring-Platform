import express from 'express';

import { getTailorShopConfigProfile, updateTailorShopConfigProfile, deleteTailorShopConfigProfile } from '../controllers/tailorShopConfigController.js';

const tailorRouter = express.Router();

tailorRouter.get('/profile/:tailorId', getTailorShopConfigProfile);
tailorRouter.post('/profile', updateTailorShopConfigProfile);
tailorRouter.delete('/profile/:tailorId', deleteTailorShopConfigProfile);

export default tailorRouter;