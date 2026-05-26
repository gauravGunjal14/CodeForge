const mongoose = require("mongoose");
const {Schema} = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        minLength: 3,
        maxLength: 20,
        required: true
    },
    lastName: {
        type: String,
        minLength: 3,
        maxLength: 20,
    },
    email: {
        type: String,
        minLength: 5,
        maxLength: 30,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
        immutable: true
    },
    age: {
        type: Number,
        min: 6,
        max: 80,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    problemSolved: {
        type: [String],
        default: []
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

module.exports = User;