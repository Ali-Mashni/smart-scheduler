// server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');


dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: 'http://localhost:3000',  // your React dev server
    credentials: true
  })
);
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/support/faqs', require('./routes/supportFaqRoutes'));
app.use('/api/support/requests', require('./routes/supportRequestRoutes'));
app.use('/api/support/messages', require('./routes/supportMessageRoutes'));


// Default route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
