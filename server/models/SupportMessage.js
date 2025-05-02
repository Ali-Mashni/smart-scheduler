// models/SupportMessage.js

const mongoose = require('mongoose');

const supportMessageSchema = new mongoose.Schema({
  request: { type: mongoose.Schema.Types.ObjectId, ref: 'SupportRequest', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Who sent the message
  message: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('SupportMessage', supportMessageSchema);
