const express = require('express');
const protect = require('../middleware/authMiddleware');
const Student = require('../models/Student');
const router = express.Router();

// GET /api/student/me
router.get('/me', protect, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied: not a student' });
    }

    const studentData = await Student.findOne({ user: req.user.id }).populate('user', 'username email firstName lastName');
    if (!studentData) return res.status(404).json({ message: 'Student data not found' });

    res.json(studentData);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ NEW: GET student activities
router.get('/activities', protect, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    res.json({ success: true, data: student.activities });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/activities', protect, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const newActivity = req.body;
    student.activities.push(newActivity);
    await student.save();

    // Return only the newly added activity (the last one in the array)
    const savedActivity = student.activities[student.activities.length - 1];

    res.status(201).json({ success: true, data: savedActivity });
  } catch (err) {
    console.error('Error saving activity:', err);
    res.status(500).json({ message: 'Server error while saving activity' });
  }
});


module.exports = router;
