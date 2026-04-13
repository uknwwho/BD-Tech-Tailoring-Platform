import Product from '../models/productModel.js';
import { v2 as cloudinary } from 'cloudinary';

// 1. ADD PRODUCT (Tailor only)
export const addProduct = async (req, res) => {
    try {
        const { name, price, description, category } = req.body;

        // Upload images to Cloudinary
        const imageUrls = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, { resource_type: 'image' });
                imageUrls.push(result.secure_url);
            }
        }

        const newProduct = new Product({
            tailor: req.user._id,
            name,
            price,
            description,
            images: imageUrls,
            category
        });

        await newProduct.save();
        res.status(201).json({ success: true, message: "Product added successfully.", product: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. GET PRODUCTS BY TAILOR (Public)
export const getProductsByTailor = async (req, res) => {
    try {
        const { tailorId } = req.params;
        const products = await Product.find({ tailor: tailorId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. GET ALL PRODUCTS (Public, with search/filter/pagination)
export const getAllProducts = async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
        const filter = {};

        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }
        if (category) {
            filter.category = category;
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const skip = (Number(page) - 1) * Number(limit);
        const total = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .populate('tailor', 'fullName profileImage rating')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        res.status(200).json({
            success: true,
            products,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. GET SINGLE PRODUCT (Public)
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('tailor', 'fullName profileImage rating bio');
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }
        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. UPDATE PRODUCT (Tailor owner only)
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }

        // Ensure the tailor owns this product
        if (product.tailor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "You can only edit your own products." });
        }

        const { name, price, description, category } = req.body;

        // Handle new image uploads
        if (req.files && req.files.length > 0) {
            const imageUrls = [];
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, { resource_type: 'image' });
                imageUrls.push(result.secure_url);
            }
            product.images = imageUrls;
        }

        if (name) product.name = name;
        if (price) product.price = price;
        if (description) product.description = description;
        if (category) product.category = category;

        await product.save();
        res.status(200).json({ success: true, message: "Product updated.", product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 6. DELETE PRODUCT (Tailor owner only)
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }

        if (product.tailor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "You can only delete your own products or must be an admin." });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Product deleted." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 7. GET MY PRODUCTS (Tailor's own products)
export const getMyProducts = async (req, res) => {
    try {
        const products = await Product.find({ tailor: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
