// routes/adminRoutes.js

const express = require('express');
const {
    getEscalatedRequests,
    getResolvedRequests,
    resolveTicket,
    reassignTicket,
    getWebsiteStatistics,
    updateAdminSettings,
    getSupportStaff
} = require('../controllers/adminController');
const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');

const router = express.Router();

// Get all escalated tickets
router.get('/tickets/escalated', protect, adminOnly, getEscalatedRequests);

// Get all resolved tickets
router.get('/tickets/resolved', protect, adminOnly, getResolvedRequests);

// Resolve a ticket
router.put('/tickets/:id/resolve', protect, adminOnly, resolveTicket);

// Reassign a ticket
router.put('/tickets/:id/reassign', protect, adminOnly, reassignTicket);

// Get website statistics
router.get('/statistics', protect, adminOnly, getWebsiteStatistics);

// Update admin settings
router.put('/settings', protect, adminOnly, updateAdminSettings);

// Get all support staff
router.get('/support-staff', protect, adminOnly, getSupportStaff);

module.exports = router; 