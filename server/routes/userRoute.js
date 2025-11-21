const express = require('express');
const router = express.Router();
const { getUser, createUser, updateUser, deleteUser } = require('../controllers/userController');

//read / view all users
router.get('/users',getUser); 

//create a new user
router.post('/users',createUser);

//update a user
router.put('/users/:id', updateUser);


//delete a user
router.delete('/users/:id', deleteUser);


module.exports = router;