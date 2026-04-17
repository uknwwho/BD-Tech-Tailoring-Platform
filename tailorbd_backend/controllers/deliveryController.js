import Delivery from '../models/deliveryModel.js';

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

        const newDelivery = new Delivery({
            orderId,
            customerName,
            deliveryAddress,
            trackingNumber,
            estimatedDeliveryDate,
            deliveryPartner, // Save the partner
            historyLog: [{ status: 'Pending' }] // Start the history log!
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