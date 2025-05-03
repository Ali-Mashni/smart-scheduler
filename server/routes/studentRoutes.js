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

// PATCH /api/student/activities/:activityId
router.patch('/activities/:activityId', protect, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const activity = student.activities.id(req.params.activityId);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });

    // Update only the completed status
    if (req.body.completed !== undefined) {
      activity.completed = req.body.completed;
    }

    await student.save();
    res.json({ success: true, data: activity });
  } catch (err) {
    console.error('Error updating activity:', err);
    res.status(500).json({ message: 'Server error while updating activity' });
  }
});

// PUT /api/student/activities/:activityId
router.put('/activities/:activityId', protect, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const activity = student.activities.id(req.params.activityId);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });

    // Update all fields
    Object.assign(activity, req.body);
    await student.save();
    
    res.json({ success: true, data: activity });
  } catch (err) {
    console.error('Error updating activity:', err);
    res.status(500).json({ message: 'Server error while updating activity' });
  }
});

// DELETE /api/student/activities/:activityId
router.delete('/activities/:activityId', protect, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      console.error('Student not found for user:', req.user.id);
      return res.status(404).json({ message: 'Student not found' });
    }

    // Convert to string for comparison
    const activity = student.activities.find(
      a => a._id.toString() === req.params.activityId
    );
    if (!activity) {
      console.error('Activity not found:', req.params.activityId);
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Remove the activity
    student.activities = student.activities.filter(
      a => a._id.toString() !== req.params.activityId
    );
    await student.save();
    res.json({ success: true, message: 'Activity deleted successfully' });
  } catch (err) {
    console.error('Error deleting activity:', err, 'ActivityId:', req.params.activityId, 'User:', req.user.id);
    res.status(500).json({ message: 'Server error while deleting activity', error: err.message });
  }
});

// PATCH /api/student/courses - add or update courses
router.patch('/courses', protect, async (req, res) => {
  try {
    const { courses } = req.body; // expects an array of {id, name}
    const student = await Student.findOne({ user: req.user.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.courses = courses;
    await student.save();
    res.json({ success: true, data: student.courses });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
