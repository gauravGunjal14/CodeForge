const { default: mongoose } = require("mongoose");
const mangoose = require("mongoose");

async function main() {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log("Connected to database successfully");
}

module.exports = main;