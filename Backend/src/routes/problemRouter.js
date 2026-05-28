const express = require('express');
const problemRouter = express.Router();
const { createProblem, updateProblem, deleteProblem, getProblems, getAllProblems, getProblemsByUser } = require('../controller/problemController');
const adminMiddleware = require('../middleware/adminMiddleware');

// admin routes
problemRouter.post('/create', adminMiddleware, createProblem);

problemRouter.patch('/:id', adminMiddleware, updateProblem);

problemRouter.delete('/:id', adminMiddleware, deleteProblem);

// user routes

problemRouter.get('/', getAllProblems);

problemRouter.get('/:id', getProblems);

problemRouter.get("/user/:userId", getProblemsByUser);

module.exports = problemRouter;