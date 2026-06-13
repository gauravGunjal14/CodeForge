const User = require('../models/UserModel');
const submission = require('../models/submissionModel');
const validateUser = require('../utils/validateUser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const redisClient = require('../config/redis');

// Register a new user
const register = async (req, res) => {
    try {
        validateUser(req.body);
        const { firstName, email, password } = req.body;

        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = 'user';

        const user = await User.create(req.body);

        const reply = {
            firstName: user.firstName,
            emailId: user.email,
            _id: user._id
        }

        const token = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_KEY, { expiresIn: '1h' });
        res.cookie("token", token, { maxAge: 3600000 }); // 3600000 ms = 1 hour
        res.status(201).json({
            user: reply,
            message: "User registered successfully"
        });
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

        if (!email)
            throw new Error("Invalid credential");
        if (!password)
            throw new Error("Invalid credential");

        const user = await User.findOne({ email });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid credential");
        }

        const reply = {
            firstName: user.firstName,
            emailId: user.email,
            _id: user._id
        }

        const token = jwt.sign({ _id: user._id, email: user.email, role: user.role }, process.env.JWT_KEY, { expiresIn: '1h' });
        res.cookie("token", token, { maxAge: 3600000 });
        res.status(200).json({
            user: reply,
            message: "User logged in successfully"
        });
    }
    catch (err) {
        res.status(500).json({ message: "Error logging in", error: err.message });
    }
}

// logout a user
const logout = async (req, res) => {
    try {
        const { token } = req.cookies;

        const payload = jwt.decode(token);

        await redisClient.set(`token:${token}`, 'Blocked');
        await redisClient.expireAt(`token:${token}`, payload.exp);

        res.cookie("token", null, { expires: new Date(Date.now() - 1000) });
        res.status(200).json({ message: "User logged out successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Error logging out", error: err.message });
    }
}

const profile = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId).select('firstName lastName email age problemSolved');

        if (!user)
            throw new Error("User not found");
        res.status(200).json({ message: "Profile fetched successfully", user });
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching profile", error: err.message });
    }
}

const adminRegister = async (req, res) => {
    try {
        validateUser(req.body);
        const { firstName, email, password } = req.body;

        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = 'admin';

        const user = await User.create(req.body);
        const token = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_KEY, { expiresIn: '1h' });
        res.cookie("token", token, { maxAge: 3600000 }); // 3600000 ms = 1 hour
        res.status(201).json({ message: "Admin registered successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Error registering admin", error: err.message });
    }
}

const deleteProfile = async (req, res) => {
    try {
        const userId = req.result._id;
        await User.findByIdAndDelete(userId);
        await submission.deleteMany({ userId });
        res.status(200).json({ message: "Profile deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Error deleting profile", error: err.message });
    }
}

module.exports = {
    register,
    login,
    logout,
    profile,
    adminRegister,
    deleteProfile
};