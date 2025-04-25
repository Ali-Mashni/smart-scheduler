const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to User
  studyHours: { type: Number, default: 0 },
  activities: [
    {
      title: String,
      description: String,
      date: Date
    }
  ]
});

module.exports = mongoose.model('Student', studentSchema);
