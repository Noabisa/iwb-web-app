const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route for signup
router.post('/signup', authController.signup);

// Route for login (initiates OTP process)
router.post('/login', authController.login);

// Route for verifying OTP
router.post('/verify-otp', authController.verifyOTP);

module.exports = router;
