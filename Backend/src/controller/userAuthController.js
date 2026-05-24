const User = require('../models/Users');
const validateUser = require('../utils/validateUser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register a new user
const register = async (req, res) => {
    try {
        validateUser(req.body);
        const { firstName, email, password } = req.body;

        req.body.password = await bcrypt.hash(password, 10);

        const user = await User.create(req.body);
        const token = jwt.sign({_id: user._id, email: user.email}, process.env.JWT_KEY, { expiresIn: '1h' });
        res.cookie("token", token, {maxAge: 3600000 }); // 3600000 ms = 1 hour
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Error registering user", error: err.message });
    }
}

// Login an existing user
const login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if(!email)
            throw new Error("Invalid credential");
        if(!password)
            throw new Error("Invalid credential");

        const user = await User.findOne({ email });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid credential");
        }

        const token = jwt.sign({_id: user._id, email: user.email}, process.env.JWT_KEY, { expiresIn: '1h' });
        res.cookie("token", token, {maxAge: 3600000 });
        res.status(200).json({ message: "User logged in successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Error logging in", error: err.message });
    }
}

// logout a user
const logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully" });
}

module.exports = {
    register,
    login,
    logout
};