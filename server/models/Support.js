const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Additional fields can be added later (ticketsHandled, etc.)
}, { timestamps: true });

module.exports = mongoose.model('Support', supportSchema);
