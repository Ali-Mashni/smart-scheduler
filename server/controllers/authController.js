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
    // Check if username OR email already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      // Determine what exactly exists (email or username)
      const conflictField = existingUser.email === email ? 'Email' : 'Username';
      return res.status(400).json({ message: `${conflictField} already exists` });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      role
    });
    // Role-specific document creation
    if (role === 'student') {
        await Student.create({ user: user._id }); // Minimal data now
      } 
      else if (role === 'admin') {
        await Admin.create({ user: user._id });   // Minimal data now
      } 
      else if (role === 'support') {
        await Support.create({ user: user._id }); // Minimal data now
      }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
