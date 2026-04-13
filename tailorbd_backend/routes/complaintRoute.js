import express from 'express';
import { createComplaint, getMyComplaints, getComplaintsForTailor, getAllComplaints, updateComplaintStatus } from '../controllers/complaintController.js';
import { protect, adminOnly, tailorOnly } from '../middleware/authMiddleware.js';

const complaintRouter = express.Router();

// Customer routes
complaintRouter.post('/', protect, createComplaint);
complaintRouter.get('/mine', protect, getMyComplaints);

// Tailor routes
complaintRouter.get('/tailor', protect, tailorOnly, getComplaintsForTailor);

// Admin routes
complaintRouter.get('/all', protect, adminOnly, getAllComplaints);
complaintRouter.patch('/:id/status', protect, adminOnly, updateComplaintStatus);

export default complaintRouter;
