const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.DB_Connection_String; 
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Stop the server if connection fails
  }
};

module.exports = connectDB;
