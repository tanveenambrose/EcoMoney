const express = require('express');
const router = express.Router();
const { signUp, login, logout, sendVerificationOtp, verifyAccount, sendResetPasswordOtp, resetPassword } = require('../controllers/authController');
const userMiddleware = require('../middlewares/userMiddleware');

// Register
router.post('/signup', signUp); 

// Login
router.post('/login', login);

// Logout
router.post('/logout', userMiddleware, logout);

// Send verification otp route (Uses userMiddleware to protect and get user ID)
router.post('/sendVerificationOtp', userMiddleware, sendVerificationOtp);

// Verify account route (Uses userMiddleware to protect and get user ID)
router.post('/verifyAccount', userMiddleware, verifyAccount);

// Send reset password otp route
router.post('/sendResetPasswordOtp', sendResetPasswordOtp);

// Reset password route
router.post('/resetPassword', resetPassword);

module.exports = router;