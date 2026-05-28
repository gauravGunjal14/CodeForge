const express = require("express");
const app = express();
require('dotenv').config();
const main = require("./config/db");
const cookieParser = require('cookie-parser')
const authRouter = require("./routes/userAuth");
const problemRouter = require("./routes/problemRouter");
const redisClient = require("./config/redis");
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/problem", problemRouter);

const initializeConnection = async () => {
    try {
        await Promise.all([main(), redisClient.connect()]);
        console.log("Connected to database and Redis successfully.");

        app.listen(process.env.PORT, () => {
            console.log('Server is running on port ' + process.env.PORT);
        });

    }
    catch (err) {
        console.log("Error Occured while connecting to database. Error: " + err);
    }
}

initializeConnection();