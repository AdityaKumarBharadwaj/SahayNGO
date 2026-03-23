const express = require('express');
const router = express.Router();
const {register, login, getMe} = require('../controllers/authController');

// Register route - public
router.post('/register', register);

// Login route - public
router.post('/login', login);

module.exports = router;