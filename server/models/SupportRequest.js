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
  },//this is to give feedback for admin contact haitham for any details 
  previousStatus: { type: String },
  resolvedAt: { type: Date },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('SupportRequest', supportRequestSchema);
