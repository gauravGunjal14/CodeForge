const express = require('express');
const authRouter = express.Router();
const { register, login, logout } = require('../controller/userAuthController');

// Importing the controller functions
// resister
authRouter.post('/register', register);

// login
authRouter.post('/login', login);

// logout
authRouter.post('/logout', logout);

// profile
// authRouter.get('/profile', profile);

module.exports = authRouter;