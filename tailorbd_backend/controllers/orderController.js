import Order from "../models/orderModel.js";
import { sendEmailAlert } from '../utils/sendEmail.js';

// Place a new order
export const placeOrder = async (req, res) => {
    try {
        const { tailorId, items, shippingAddress, notes, totalAmount } = req.body;
        const customerId = req.user.id; // From protect middleware

        const newOrder = new Order({
            customer: customerId,
            tailor: tailorId,
            items,
            shippingAddress,
            notes,
            totalAmount
        });

        const savedOrder = await newOrder.save();

        //NEW ORDER EMAIL
        if (req.user && req.user.email) {
            await sendEmailAlert(
                req.user.email,
                "TailorTech: Order Placed Successfully!",
                `Thank you for your order! Your tailor has been notified. We will email you the moment they accept your order and begin working on it.`
            );
        }

        res.status(201).json({ success: true, message: "Order placed successfully", order: savedOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ... (getMyOrders, getTailorOrders, getAllOrders stay exactly the same!) ...

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user.id })
            .populate('tailor', 'fullName email')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getTailorOrders = async (req, res) => {
    try {
        const orders = await Order.find({ tailor: req.user.id })
            .populate('customer', 'fullName phone email')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('customer', 'fullName')
            .populate('tailor', 'fullName')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update order status (Admin or Tailor)
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        // CRUCIAL: We added .populate() here so we can get the customer's email!
        const order = await Order.findById(orderId).populate('customer', 'fullName email name');

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Check permission: Tailor can only update their own orders
        if (req.user.role === 'tailor' && order.tailor.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Unauthorized to update this order" });
        }

        order.status = status;
        await order.save();

        // AUTOMATED EMAILS

        if (order.customer && order.customer.email) {
            const customerEmail = order.customer.email;
            const customerName = order.customer.fullName || order.customer.name || 'Valued Customer';

            let emailSubject = `Order Update: ${status}`;
            let emailMessage = `Hello ${customerName}, your order status has been updated to: ${status}.`;

            if (status === 'Accepted') {
                emailSubject = "TailorTech: Your Order has been Accepted!";
                emailMessage = `Great news, ${customerName}! Your tailor has reviewed your measurements and accepted your order. They will begin cutting the fabric soon.`;
            } else if (status === 'In Progress' || status === 'Processing') {
                emailSubject = "TailorTech: Your clothes are being stitched!";
                emailMessage = `Hello ${customerName}, your tailor has started stitching your items! We will notify you as soon as they are finished and ready for dispatch.`;
            } else if (status === 'Ready for Delivery' || status === 'Completed') {
                emailSubject = "TailorTech: Your order is Ready!";
                emailMessage = `Awesome news, ${customerName}! Your order is completely stitched and ready. It will be handed over to our delivery partners shortly.`;
            }

            await sendEmailAlert(customerEmail, emailSubject, emailMessage);
        }

        res.status(200).json({ success: true, message: "Order status updated", order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update payment status (Admin Only)
export const updatePaymentStatus = async (req, res) => {
    try {
        const { orderId, paymentStatus } = req.body;
        const order = await Order.findByIdAndUpdate(orderId, { paymentStatus }, { returnDocument: 'after' }).populate('customer', 'email fullName');

        // ==========================================
        // FEATURE 12: PAYMENT RECEIVED EMAIL
        // ==========================================
        if (paymentStatus === 'Paid' && order.customer && order.customer.email) {
            await sendEmailAlert(
                order.customer.email,
                "TailorTech: Payment Received",
                `Hello! We have successfully received your payment for Order ID: ${order._id}. Thank you!`
            );
        }

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};