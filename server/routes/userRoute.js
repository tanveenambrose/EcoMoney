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
    getUserData,
    changePassword // <-- Import the new controller
} = require('../controllers/userController');

const upload = multer({ dest: 'uploads/' });

// --- Profile Routes ---
router.get('/data', userMiddleware, getUserData);
router.put('/update-profile', userMiddleware, upload.single('image'), updateUserProfile);
// Add new route for changing password. Must be POST for security.
router.post('/change-password', userMiddleware, changePassword); 


// --- Admin Routes ---
router.get('/users', getUser); 
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;