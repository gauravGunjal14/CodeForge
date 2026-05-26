const express = require('express');
const authRouter = express.Router();
const { register, login, logout, adminRegister } = require('../controller/userAuthController');
const authenticateToken = require('../middleware/authenticateToken');
const adminMiddleware = require('../middleware/adminMiddleware');

// Importing the controller functions
// resister
authRouter.post('/register', register);

// login
authRouter.post('/login', login);

// logout
authRouter.post('/logout', authenticateToken, logout);


authRouter.post('/admin/register', adminMiddleware, adminRegister);
// profile
// authRouter.get('/profile', profile);

module.exports = authRouter;