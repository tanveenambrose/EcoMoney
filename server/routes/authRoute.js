const express = require('express');
const router = express.Router();
const { 
    signUp, 
    login, 
    logout, 
    sendVerificationOtp, 
    verifyAccount, 
    sendResetPasswordOtp, 
    resetPassword,
    isAuthenticated // <--- Import this
} = require('../controllers/authController');
const userMiddleware = require('../middlewares/userMiddleware');

// Register
router.post('/signup', signUp); 

// Login
router.post('/login', login);

// Logout
router.post('/logout', userMiddleware, logout);

// Send verification otp
router.post('/sendVerificationOtp', userMiddleware, sendVerificationOtp);

// Verify account
router.post('/verifyAccount', userMiddleware, verifyAccount);

// Send reset password otp
router.post('/sendResetPasswordOtp', sendResetPasswordOtp);

// Reset password
router.post('/resetPassword', resetPassword);

// --- UPDATED ROUTE ---
// Removed userMiddleware so guests don't trigger a 401 error
router.get('/is-auth', isAuthenticated);

module.exports = router;