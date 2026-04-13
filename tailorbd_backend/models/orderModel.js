import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tailor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 }
    }],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        city: { type: String, required: true },
        address: { type: String, required: true }
    },
    notes: { type: String },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Processing', 'Cancelled', 'Delivered'],
        default: 'Pending'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid'],
        default: 'Pending'
    }
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
