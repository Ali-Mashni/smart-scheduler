const express = require('express');
const { createFAQ, getAllFAQs, updateFAQ, deleteFAQ } = require('../controllers/supportFaqController');
const protect = require('../middleware/authMiddleware');


const router = express.Router();

// Create a new FAQ (Agent)
router.post('/', protect, createFAQ);

// Get all FAQs (Student or Agent)
router.get('/', getAllFAQs);

// Update an existing FAQ (Agent)
router.put('/:id', protect, updateFAQ);

// Delete an FAQ (Agent)
router.delete('/:id', protect, deleteFAQ);

module.exports = router;
