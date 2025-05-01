// models/Student.js
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  activityName: { type: String },
  activityType: { type: String },
  academicDetail: { type: String },
  subjectId: { type: String },
  isPermanent: { type: Boolean },
  selectedDays: [{ type: String }],
  selectedDate: { type: String },
  startTime: { type: String },
  endTime: { type: String },
  completed: { type: Boolean, default: false }
}, { _id: true });

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  activities: [activitySchema]
});

module.exports = mongoose.model('Student', studentSchema);
