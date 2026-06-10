const express = require('express');
const submitRouter = express.Router();
const userMiddleware = require('../middleware/userMiddleware');
const {submitController, runCode} = require('../controller/submitController');

submitRouter.post("/submit/:id", userMiddleware, submitController);
submitRouter.post("/run/:id", userMiddleware, runCode);

module.exports = submitRouter;