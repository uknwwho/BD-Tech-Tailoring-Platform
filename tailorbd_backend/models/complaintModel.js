import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['product', 'tailor'],
        required: true
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
        type: String,
        enum: ['Pending', 'In Review', 'Resolved'],
        default: 'Pending'
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetTailor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' } // Only if type is 'product'
}, { timestamps: true });

const Complaint = mongoose.models.Complaint || mongoose.model('Complaint', complaintSchema);
export default Complaint;
