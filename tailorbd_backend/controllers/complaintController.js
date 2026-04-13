import Complaint from '../models/complaintModel.js';

// 1. CREATE COMPLAINT (Customer only)
export const createComplaint = async (req, res) => {
    try {
        const { type, title, description, targetTailor, targetProduct } = req.body;

        const complaint = new Complaint({
            type,
            title,
            description,
            createdBy: req.user._id,
            targetTailor,
            targetProduct: type === 'product' ? targetProduct : undefined
        });

        await complaint.save();
        res.status(201).json({ success: true, message: "Complaint submitted successfully.", complaint });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. GET MY COMPLAINTS (Customer views their own)
export const getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ createdBy: req.user._id })
            .populate('targetTailor', 'fullName email')
            .populate('targetProduct', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, complaints });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. GET COMPLAINTS FOR TAILOR (Tailor views complaints about them)
export const getComplaintsForTailor = async (req, res) => {
    try {
        const complaints = await Complaint.find({ targetTailor: req.user._id })
            .populate('createdBy', 'fullName email')
            .populate('targetProduct', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, complaints });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. GET ALL COMPLAINTS (Admin only)
export const getAllComplaints = async (req, res) => {
    try {
        const { status, type } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (type) filter.type = type;

        const complaints = await Complaint.find(filter)
            .populate('createdBy', 'fullName email')
            .populate('targetTailor', 'fullName email')
            .populate('targetProduct', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, complaints });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. UPDATE COMPLAINT STATUS (Admin only)
export const updateComplaintStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const complaint = await Complaint.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate('createdBy', 'fullName email')
         .populate('targetTailor', 'fullName email');

        if (!complaint) {
            return res.status(404).json({ success: false, message: "Complaint not found." });
        }

        res.status(200).json({ success: true, message: "Complaint status updated.", complaint });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
