const express = require('express');
const submitRouter = express.Router();
const userMiddleware = require('../middleware/userMiddleware');
const {submitController, runCode} = require('../controller/submitController');

submitRouter.post("/submit/:pid", userMiddleware, submitController);
submitRouter.post("/run/:pid", userMiddleware, runCode);

module.exports = submitRouter;