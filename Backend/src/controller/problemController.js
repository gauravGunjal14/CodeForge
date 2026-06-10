const { get } = require('mongoose');
const problemModel = require('../models/problemModel');
const userModel = require('../models/UserModel');
const { getLanguageById, submitBatch, submitToken } = require('../utils/problemUtility');

const createProblem = async (req, res) => {
    try {
        const { title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, referenceSolution, problemCreator } = req.body;
        for (const { language, completeCode } of referenceSolution) {

            const languageId = getLanguageById(language);
            if (!languageId) {
                return res.status(400).json({ message: `Unsupported language: ${language}` });
            }

            const submissions = visibleTestCases.map((testCase) => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: testCase.input,
                expected_output: testCase.output
            }));

            const submitBatchs = await submitBatch(submissions);

            if (!submitBatchs || !Array.isArray(submitBatchs)) {
                return res.status(400).json({
                    message: "Judge0 did not return submission tokens"
                });
            }

            const resultTokens = submitBatchs.map((value) => value.token);

            const testResults = await submitToken(resultTokens);

            for (const test of testResults) {
                if (test.status.id !== 3) {
                    return res.status(400).json({ message: `Reference solution failed for test case with input: ${test.stdin}` });
                }
            }
        }

        const userProblem = await problemModel.create({
            ...req.body,
            problemCreator: req.result._id
        });

        res.status(201).json({ message: "Problem created successfully", problem: userProblem });
    }
    catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Error creating problem",
            error: err.message,
            stack: err.stack
        });
    }
};

const updateProblem = async (req, res) => {
    try {
        const { title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, referenceSolution, problemCreator } = req.body;
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: "Problem id is required" });
        }

        const existingProblem = await problemModel.findById(id);
        if (!existingProblem) {
            return res.status(404).send("ID is not present.");
        }

        for (const { language, completeCode } of referenceSolution) {

            const languageId = getLanguageById(language);
            if (!languageId) {
                return res.status(400).json({ message: `Unsupported language: ${language}` });
            }

            const submissions = visibleTestCases.map((testCase) => ({
                source_code: completeCode,
                language_id: languageId,
                stdin: testCase.input,
                expected_output: testCase.output
            }));

            const submitBatchs = await submitBatch(submissions);

            if (!submitBatchs || !Array.isArray(submitBatchs)) {
                return res.status(400).json({
                    message: "Judge0 did not return submission tokens"
                });
            }

            const resultTokens = submitBatchs.map((value) => value.token);

            const testResults = await submitToken(resultTokens);

            for (const test of testResults) {
                if (test.status.id !== 3) {
                    return res.status(400).json({ message: `Reference solution failed for test case with input: ${test.stdin}` });
                }
            }
        }

        const newProblem = await problemModel.findByIdAndUpdate(id, { ...req.body }, { runValidators: true, new: true });

        res.status(200).json({ message: "Problem updated successfully", problem: newProblem });
    }
    catch (err) {
        res.status(500).json({ message: "Error updating problem", error: err.message });
    }
};

const deleteProblem = async (req, res) => {
    try {
        const problemId = req.params.id;
        if (!problemId) {
            return res.status(400).json({ message: "Problem id is required" });
        }

        const deletedProblem = await problemModel.findByIdAndDelete(problemId);
        if (!deletedProblem) {
            return res.status(404).json({ message: "Problem not found" });
        }

        res.status(200).json({ message: "Problem deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Error deleting problem", error: err.message });
    }
};

const getAllProblems = async (req, res) => {
    try {
        const problems = await problemModel.find().select('_id title description difficulty tags visibleTestCases startCode');
        if (!problems || problems.length === 0) {
            return res.status(404).json({ message: "No problems found" });
        }

        res.status(200).json(problems);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching problems", error: err.message });
    }
};

const getProblems = async (req, res) => {
    try {
        const problemId = req.params.id;
        if (!problemId) {
            return res.status(400).json({ message: "Problem id is required" });
        }

        const problem = await problemModel.findById(problemId).select('_id title description difficulty tags visibleTestCases startCode');
        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }
        res.status(200).json(problem);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching problem", error: err.message });
    }
};

const getProblemsByUser = async (req, res) => {
    try {
        const userId = req.result._id;

        const user = await User.findById(userId).populate({
            path: 'problemSolved',
            select: '_id title difficulty tags'
        });


        res.status(200).send(user.problemSolved);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching problems", error: err.message });
    }
};

module.exports = {
    createProblem,
    updateProblem,
    deleteProblem,
    getProblems,
    getAllProblems,
    getProblemsByUser
};