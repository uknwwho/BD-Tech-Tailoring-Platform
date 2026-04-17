import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    customerName: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    deliveryPartner: { type: String, default: 'Unassigned' },
    status: {
        type: String,
        enum: ['Pending', 'Assigned', 'Picked Up', 'Out for Delivery', 'Delivered', 'Failed'], // Added a few extra realistic statuses!
        default: 'Pending'
    },
    trackingNumber: { type: String },
    estimatedDeliveryDate: { type: Date },
    historyLog: [{
        status: { type: String },
        timestamp: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

const Delivery = mongoose.models.Delivery || mongoose.model('Delivery', deliverySchema);
export default Delivery;