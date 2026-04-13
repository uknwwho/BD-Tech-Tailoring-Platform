import express from 'express';
import { addProduct, getAllProducts, getProductById, getProductsByTailor, updateProduct, deleteProduct, getMyProducts } from '../controllers/productController.js';
import { protect, tailorOnly } from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';

const productRouter = express.Router();

// Tailor-only routes (MUST come before /:id to avoid conflicts)
productRouter.get('/my/products', protect, tailorOnly, getMyProducts);
productRouter.post('/', protect, tailorOnly, upload.array('images', 4), addProduct);
productRouter.put('/:id', protect, tailorOnly, upload.array('images', 4), updateProduct);
productRouter.delete('/:id', protect, tailorOnly, deleteProduct);

// Public routes
productRouter.get('/', getAllProducts);
productRouter.get('/tailor/:tailorId', getProductsByTailor);
productRouter.get('/:id', getProductById);

export default productRouter;
