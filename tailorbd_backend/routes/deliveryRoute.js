import express from 'express';
import { createDelivery, getDeliveries, updateDeliveryStatus, deleteDelivery } from '../controllers/deliveryController.js';

const deliveryRouter = express.Router();

deliveryRouter.post('/create', createDelivery);
deliveryRouter.get('/all', getDeliveries);
deliveryRouter.delete('/delete/:id', deleteDelivery);
deliveryRouter.patch('/status/:id', updateDeliveryStatus);

export default deliveryRouter;
