const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  //this is to calculate progress in admin page , contact haitham for any details 
  ticketsAssigned: { type: Number, default: 0 },
  ticketsHandled: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Support', supportSchema);
