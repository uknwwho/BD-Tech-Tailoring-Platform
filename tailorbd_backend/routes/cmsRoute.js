import express from 'express';
import {
    addBanner, getBanners, toggleBannerStatus, deleteBanner,
    addPromotion, getPromotions, deletePromotion, updatePromotionStatus
} from '../controllers/cmsController.js';

const cmsRouter = express.Router();

// Banner
cmsRouter.post('/banners', addBanner);
cmsRouter.get('/banners', getBanners);
cmsRouter.patch('/banners/:id', toggleBannerStatus);
cmsRouter.delete('/banners/:id', deleteBanner);

// Promotion
cmsRouter.post('/promotions', addPromotion);
cmsRouter.get('/promotions', getPromotions);
cmsRouter.delete('/promotions/:id', deletePromotion);
cmsRouter.patch('/promotions/:id', updatePromotionStatus);

export default cmsRouter;
