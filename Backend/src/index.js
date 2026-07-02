const express = require("express");
const app = express();
require('dotenv').config();
const main = require("./config/db");
const cookieParser = require('cookie-parser')
const authRouter = require("./routes/userAuth");
const problemRouter = require("./routes/problemRouter");
const submitRouter = require("./routes/submit");
const aiRouter = require("./routes/aiRouter")
const redisClient = require("./config/redis");
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/problem", problemRouter);
app.use("/api/submission", submitRouter);
app.use("/api/ai", aiRouter);

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