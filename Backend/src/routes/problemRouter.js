const express = require('express');
const problemRouter = express.Router();
const { createProblem, updateProblem, deleteProblem, getProblems, getAllProblems, getProblemsByUser } = require('../controller/problemController');
const adminMiddleware = require('../middleware/adminMiddleware');
const userMiddleware = require('../middleware/userMiddleware');
// admin routes
problemRouter.post('/create', adminMiddleware, createProblem);

problemRouter.put('/update/:id', adminMiddleware, updateProblem);

problemRouter.delete('/delete/:id', adminMiddleware, deleteProblem);

// user routes

problemRouter.get('/getall', userMiddleware, getAllProblems);

problemRouter.get('/get/:id', userMiddleware, getProblems);

problemRouter.get("/solvedByUser", userMiddleware, getProblemsByUser);

module.exports = problemRouter;