import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
        street: String,
        city: String,
        division: String,
        postalCode: String
    },
    role: { type: String, enum: ['customer', 'tailor', 'admin'], default: 'customer' },
    measurementProfiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Measurement' }]
}, { timestamps: true });


const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;

