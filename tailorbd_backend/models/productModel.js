import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    tailor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    images: [{ type: String }], // Cloudinary URLs (up to 4)
    category: {
        type: String,
        enum: [
            'Man: Shirt', 'Man: Pant', 'Man: Suit', 'Man: Panjabi', 'Man: Blazer', 'Man: Waistcoat',
            'Woman: Saree', 'Woman: Salwar Kameez', 'Woman: Lehanga', 'Woman: Kurti', 'Woman: Gown', 'Woman: Abaya/Burqa', 'Woman: Blouse', 'Woman: Petticoat',
            'Kids: Frock', 'Kids: Panjabi', 'Kids: Shirt', 'Kids: Pant', 'Kids: Suit/Tuxedo',
            'Other: Alterations', 'Other: Uniforms', 'Other: Wedding Special'
        ],
        required: true
    }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
