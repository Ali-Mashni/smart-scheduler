// server/controllers/studentActivityController.js
const Student = require('../models/Student');

// GET /api/activities
exports.getActivities = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student.activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/activities
exports.addActivity = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // push the new activity into the embedded array
    student.activities.push({
      activityName:  req.body.activityName,
      activityType:  req.body.activityType,
      academicDetail:req.body.academicDetail,
      subjectId:     req.body.subjectId,
      isPermanent:   req.body.isPermanent,
      selectedDays:  req.body.selectedDays,
      selectedDate:  req.body.selectedDate,
      startTime:     req.body.startTime,
      endTime:       req.body.endTime
    });

    await student.save();

    // return the newly‐added activity (it's the last element in the array)
    const newAct = student.activities[student.activities.length - 1];
    res.status(201).json(newAct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/activities/:actId
exports.updateActivity = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const act = student.activities.id(req.params.actId);
    if (!act) return res.status(404).json({ message: 'Activity not found' });

    // update only the fields you allow
    act.activityName   = req.body.activityName   ?? act.activityName;
    act.activityType   = req.body.activityType   ?? act.activityType;
    act.academicDetail = req.body.academicDetail ?? act.academicDetail;
    act.subjectId      = req.body.subjectId      ?? act.subjectId;
    act.isPermanent    = req.body.isPermanent    ?? act.isPermanent;
    act.selectedDays   = req.body.selectedDays   ?? act.selectedDays;
    act.selectedDate   = req.body.selectedDate   ?? act.selectedDate;
    act.startTime      = req.body.startTime      ?? act.startTime;
    act.endTime        = req.body.endTime        ?? act.endTime;

    await student.save();
    res.json(act);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/activities/:actId
exports.deleteActivity = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const act = student.activities.id(req.params.actId);
    if (!act) return res.status(404).json({ message: 'Activity not found' });

    act.remove();
    await student.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
