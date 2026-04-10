import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';

import authRouter from './routes/authRoute.js';
import cmsRouter from './routes/cmsRoute.js';
import deliveryRouter from './routes/deliveryRoute.js';
import tailorRouter from './routes/tailorRoute.js';


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
app.use('/api/tailors', tailorRouter);

//API endpoints
app.get('/', (req, res) => {
    res.status(200).send('API working');
});

//Listener
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});