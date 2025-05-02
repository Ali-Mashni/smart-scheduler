const mongoose = require('mongoose');

const supportFaqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('SupportFAQ', supportFaqSchema);
