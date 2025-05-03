const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Calculus I"
  code: { type: String }, // e.g., "MATH101" (optional, but useful)
  // You can add more fields if needed, such as description, credits, etc.
});

module.exports = mongoose.model('Course', courseSchema);
