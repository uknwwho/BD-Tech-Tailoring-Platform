import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';

import cmsRouter from './routes/cmsRoute.js';
import deliveryRouter from './routes/deliveryRoute.js';


//App config
const app = express();
const port = process.env.PORT || 5000;
connectDB();
connectCloudinary();

//Middlewares
app.use(express.json());
app.use(cors());
app.use('/api/cms', cmsRouter);
app.use('/api/delivery', deliveryRouter);

//API endpoints
app.get('/', (req, res) => {
    res.status(200).send('API working');
});

//Listener
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});