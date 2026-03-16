import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    customerName: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Out for Delivery', 'Delivered', 'Failed'],
        default: 'Pending'
    },
    trackingNumber: { type: String },
    estimatedDeliveryDate: { type: Date }
}, { timestamps: true });

const Delivery = mongoose.models.Delivery || mongoose.model('Delivery', deliverySchema);
export default Delivery;