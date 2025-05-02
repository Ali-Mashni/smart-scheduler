const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },// this is for compliting settings modal in admin page, contact haitham for any details
  role: { type: String, enum: ['student', 'admin', 'support'], default: 'student' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
