const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Additional fields can be added later (permissions, department, etc.)
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
