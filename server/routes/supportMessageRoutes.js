// routes/supportMessageRoutes.js

const express = require('express');
const { createMessage, getAllMessages } = require('../controllers/supportMessageController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Send a message in a support request (Student or Agent)
router.post('/', protect, createMessage);

// Get all messages for a support request (Student or Agent)
router.get('/:requestId', protect, getAllMessages);

module.exports = router;
