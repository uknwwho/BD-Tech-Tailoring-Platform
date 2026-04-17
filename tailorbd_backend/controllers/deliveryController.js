import Delivery from '../models/deliveryModel.js';
import { sendEmailAlert } from '../utils/sendEmail.js';
import Order from '../models/orderModel.js';

// POST
// export const createDelivery = async (req, res) => {
//     try {
//         const { orderId, customerName, deliveryAddress, trackingNumber, estimatedDeliveryDate } = req.body;

//         const newDelivery = new Delivery({
//             orderId, customerName, deliveryAddress, trackingNumber, estimatedDeliveryDate
//         });

//         await newDelivery.save();
//         res.status(201).json({ success: true, message: "Delivery created successfully", delivery: newDelivery });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

export const createDelivery = async (req, res) => {
    try {
        const { orderId, customerName, deliveryAddress, trackingNumber, estimatedDeliveryDate, deliveryPartner } = req.body;
        let autoEmail = "no-email@found.com";

        try {
            const allOrders = await Order.find().populate('customer');

            const matchedOrder = allOrders.find(order => {
                const realId = order._id.toString();
                const prettyId = "#" + realId.slice(-8).toUpperCase();
                return realId === orderId || prettyId === orderId || realId.slice(-8).toUpperCase() === orderId;
            });

            if (matchedOrder && matchedOrder.customer && matchedOrder.customer.email) {
                autoEmail = matchedOrder.customer.email;
            }
        } catch (err) {
            console.log("Could not find order to pull email. Error:", err.message);
        }

        const newDelivery = new Delivery({
            orderId,
            customerName,
            customerEmail: autoEmail,
            deliveryAddress,
            trackingNumber,
            estimatedDeliveryDate,
            deliveryPartner,
            historyLog: [{ status: 'Pending' }]
        });

        await newDelivery.save();
        res.status(201).json({ success: true, message: "Delivery created successfully", delivery: newDelivery });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET
export const getDeliveries = async (req, res) => {
    try {
        const deliveries = await Delivery.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, deliveries });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update

// export const updateDeliveryStatus = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { status } = req.body;

//         const updatedDelivery = await Delivery.findByIdAndUpdate(
//             id,
//             { status },
//             { new: true } // Returns the updated document
//         );
//         res.status(200).json({ success: true, message: "Delivery status updated", delivery: updatedDelivery });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

export const updateDeliveryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Find the delivery, update the status, AND push the new status into the history log array
        const updatedDelivery = await Delivery.findByIdAndUpdate(
            id,
            {
                $set: { status: status },
                $push: { historyLog: { status: status } } // This line is the magic history log keeper!
            },
            { returnDocument: 'after' }
        );
        // Email Alart

        if (updatedDelivery && updatedDelivery.customerEmail) {
            let emailSubject = `Update on your TailorTech Order: ${updatedDelivery.orderId}`;
            let emailMessage = `Hello ${updatedDelivery.customerName}, the status of your delivery has been updated to: **${status}**.`;

            if (status === 'Out for Delivery') {
                emailMessage = `Great news ${updatedDelivery.customerName}! Your order (${updatedDelivery.orderId}) is out for delivery via ${updatedDelivery.deliveryPartner}. Have your phone ready!`;
            } else if (status === 'Delivered') {
                emailMessage = `Success! Your order (${updatedDelivery.orderId}) has been successfully delivered. Thank you for choosing TailorTech!`;
            }

            await sendEmailAlert(updatedDelivery.customerEmail, emailSubject, emailMessage);
        }

        res.status(200).json({ success: true, message: "Delivery status updated", delivery: updatedDelivery });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

//Delete
export const deleteDelivery = async (req, res) => {
    try {
        const { id } = req.params;
        await Delivery.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Delivery record deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};