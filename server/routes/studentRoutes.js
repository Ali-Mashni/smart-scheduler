const express = require('express');
const protect = require('../middleware/authMiddleware');
const Student = require('../models/Student');
const router = express.Router();
const mongoose = require('mongoose');

// GET /api/student/me
router.get('/me', protect, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied: not a student' });
    }

    const studentData = await Student.findOne({ user: req.user.id }).populate('user', 'username email firstName lastName');

    if (!studentData) {
      return res.status(404).json({ message: 'Student data not found' });
    }

    res.json(studentData);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
