const express = require('express');
const authRouter = express.Router();
const { register, login, logout, profile, adminRegister, deleteProfile } = require('../controller/userAuthController');
const userMiddleware = require('../middleware/userMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Importing the controller functions
// resister
authRouter.post('/register', register);

// login
authRouter.post('/login', login);

// logout
authRouter.post('/logout', userMiddleware, logout);

authRouter.get('/profile/:id', userMiddleware, profile);

authRouter.post('/admin/register', adminMiddleware, adminRegister);

authRouter.delete('/delete/profile', userMiddleware, deleteProfile);

authRouter.get('/check', userMiddleware, (req, res) =>{
    const reply = {
        firstName: req.user.firstName,
        emailId: req.user.email,
        _id: req.user._id,
        role: req.user.role
    }

    res.status(200).json({
        user: reply,
        message: "valid user"
    })
});

module.exports = authRouter;