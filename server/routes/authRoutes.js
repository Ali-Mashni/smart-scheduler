const express = require('express');
const { register, login, getUser, getCurrentUser } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user/:id', getUser);
router.get('/me', protect, getCurrentUser);

module.exports = router;
