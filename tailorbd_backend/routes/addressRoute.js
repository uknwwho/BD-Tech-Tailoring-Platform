import express from 'express';
import { searchAddress, reverseGeocode } from '../controllers/addressController.js';

const addressRouter = express.Router();

addressRouter.get('/search', searchAddress);
addressRouter.get('/reverse', reverseGeocode);

export default addressRouter;
