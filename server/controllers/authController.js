// controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Admin = require('../models/Admin');
const Support = require('../models/Support');

// Register Controller
exports.register = async (req, res) => {
  const { firstName, lastName, username, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      const conflictField = existingUser.email === email ? 'Email' : 'Username';
      return res.status(400).json({
        success: false,
        message: `${conflictField} already exists.`
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      role
    });

    if (role === 'student') {
      await Student.create({ user: user._id });
    } else if (role === 'admin') {
      await Admin.create({ user: user._id });
    } else if (role === 'support') {
      await Support.create({ user: user._id });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration.'
    });
  }
};

// Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login.'
    });
  }
};

// Get User by ID
exports.getUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error fetching user data'
    });
  }
};

// Get Current User
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error fetching current user data'
    });
  }
};
