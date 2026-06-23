const jwt = require('jsonwebtoken');
require('dotenv').config();
const UserModel = require('../models/UserModel');
const redisClient = require('../config/redis');

const adminMiddleware = async (req, res, next) => {
    console.log("Cookies:", req.cookies);
    console.log("Token:", req.cookies?.token);
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const payload = jwt.verify(token, process.env.JWT_KEY);

        const { _id } = payload;
        if (!_id) {
            return res.status(401).json({ message: "Access denied. Invalid token." });
        }

        const user = await UserModel.findById(_id);
        if (!user) {
            return res.status(401).json({ message: "Access denied. Invalid token." });
        }

        const isBlocked = await redisClient.exists(`token:${token}`);

        if (isBlocked) {
            return res.status(401).json({ message: "Access denied. Token is blocked." });
        }

        req.user = user;

        const isAdmin = user.role === 'admin';

        if (!isAdmin) {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        next();
    }
    catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = adminMiddleware;