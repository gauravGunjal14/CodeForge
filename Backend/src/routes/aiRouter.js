const express = require('express');
const aiRouter = express.Router();
const solveDoubt = require('../controller/solveDoubt');
const userMiddleware = require('../middleware/userMiddleware');

aiRouter.post('/chat', userMiddleware, solveDoubt);

module.exports = aiRouter;