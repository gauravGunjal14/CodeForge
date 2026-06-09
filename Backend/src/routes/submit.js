const express = require('express');
const submitRouter = express.Router();
const userMiddleware = require('../middleware/userMiddleware');
const submitController = require('../controller/submitController');

submitRouter.post("/submit/:id", userMiddleware, submitController);

module.exports = submitRouter;