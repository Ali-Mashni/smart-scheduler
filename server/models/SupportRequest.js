// models/SupportRequest.js

const mongoose = require('mongoose');

const supportRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Student who opened the request
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Support agent assigned
  title: { type: String, required: true }, // Title of the request
  description: { type: String, required: true }, // Initial message
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'Dismissed', 'Escalated'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('SupportRequest', supportRequestSchema);
