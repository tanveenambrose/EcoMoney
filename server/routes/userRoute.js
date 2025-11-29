const express = require('express');
const router = express.Router();
const multer = require('multer');
const userMiddleware = require('../middlewares/userMiddleware');
const { 
    getUser, 
    createUser, 
    updateUser, 
    deleteUser, 
    updateUserProfile, 
    getUserData 
} = require('../controllers/userController');

// Configure Multer to store file locally temporarily
// Ensure you have a folder named 'uploads' in your server root!
const upload = multer({ dest: 'uploads/' });

// --- Profile Routes ---

// Get current user data
router.get('/data', userMiddleware, getUserData);

// Update profile (Text + Image)
router.put('/update-profile', userMiddleware, upload.single('image'), updateUserProfile);

// --- Admin Routes ---
router.get('/users', getUser); 
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;