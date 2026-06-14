const jwt = require('jsonwebtoken');
require('dotenv').config();
const UserModel = require('../models/UserModel');
const redisClient = require('../config/redis');

const userMiddleware = async (req, res, next) => {
    try{
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const payload = jwt.verify(token, process.env.JWT_KEY);
        
        const {_id} = payload;
        if(!_id){
            return res.status(401).json({ message: "Access denied. Invalid token." });
        }

        const user = await UserModel.findOne({_id});
        if(!user){
            return res.status(401).json({ message: "Access denied. Invalid token." });
        }

        const isBlocked = await redisClient.exists(`token:${token}`);

        if(isBlocked){
            return res.status(401).json({ message: "Access denied. Token is blocked." });
        }

        req.user = user;

        next();
    }
    catch(err){
        res.status(403).json({ message: "Invalid or expired token." });
    }
}

module.exports = userMiddleware;