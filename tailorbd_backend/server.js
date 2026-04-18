import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';

import authRouter from './routes/authRoute.js';
import cmsRouter from './routes/cmsRoute.js';
import deliveryRouter from './routes/deliveryRoute.js';
import tailorShopConfigRouter from './routes/tailorShopConfigRoute.js';

import productRouter from './routes/productRoute.js';
import complaintRouter from './routes/complaintRoute.js';
import tailorRouter from './routes/tailorRoute.js';
import orderRouter from './routes/orderRoute.js';
import addressRouter from './routes/addressRoute.js';
import reviewRouter from './routes/reviewRoute.js';

//App config
const app = express();
const port = process.env.PORT || 5000;
connectDB();
connectCloudinary();

//Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/api/auth', authRouter);
app.use('/api/cms', cmsRouter);
app.use('/api/delivery', deliveryRouter);
app.use('/api/tailor-config', tailorShopConfigRouter);
app.use('/api/products', productRouter);
app.use('/api/complaints', complaintRouter);
app.use('/api/tailors', tailorRouter);
app.use('/api/orders', orderRouter);
app.use('/api/address', addressRouter);
app.use('/api/reviews', reviewRouter);

//API endpoints
app.get('/', (req, res) => {
    res.status(200).send('API working');
});

//Listener
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});