import Order from "../models/orderModel.js";

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
        res.status(201).json({ success: true, message: "Order placed successfully", order: savedOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get orders for the logged-in user (Customer)
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

// Get orders for a tailor
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

// Get all orders (Admin)
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
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Check permission: Tailor can only update their own orders
        if (req.user.role === 'tailor' && order.tailor.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Unauthorized to update this order" });
        }

        order.status = status;
        await order.save();
        res.status(200).json({ success: true, message: "Order status updated", order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update payment status (Admin Only)
export const updatePaymentStatus = async (req, res) => {
    try {
        const { orderId, paymentStatus } = req.body;
        const order = await Order.findByIdAndUpdate(orderId, { paymentStatus }, { new: true });
        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
