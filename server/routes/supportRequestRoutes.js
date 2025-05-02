// routes/supportRequestRoutes.js

const express = require('express');
const { createRequest, getRequests, updateRequestStatus } = require('../controllers/supportRequestController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new support request (Student)
router.post('/', protect, createRequest);

// Get all support requests (Agent or Admin can view)
router.get('/', protect, getRequests);

// Update the status of a support request (Agent)
router.put('/:id/status', protect, updateRequestStatus);

module.exports = router;
