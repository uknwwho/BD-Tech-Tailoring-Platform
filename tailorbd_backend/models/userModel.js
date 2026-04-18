// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     fullName: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     phone: { type: String, required: true },
//     address: {
//         street: String,
//         city: String,
//         division: String,
//         postalCode: String
//     },
//     role: { type: String, enum: ['customer', 'tailor', 'admin'], default: 'customer' },
//     measurementProfiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Measurement' }]
// }, { timestamps: true });


// const User = mongoose.models.User || mongoose.model('User', userSchema);
// export default User;

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
        postalCode: String,
        lat: Number,
        lng: Number
    },
    role: { type: String, enum: ['customer', 'tailor', 'admin'], default: 'customer' },
    measurementProfiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Measurement' }],

    // Tailor Profile Fields
    profileImage: { type: String, default: '' },
    bio: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });


const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
