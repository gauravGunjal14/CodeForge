const problemModel = require('../models/problemModel');
const userModel = require('../models/UserModel');
const Submission = require('../models/submissionModel');
const { getLanguageById, submitBatch, submitToken } = require('../utils/problemUtility');

const createProblem = async (req, res) => {
    try {
        const { title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, referenceSolution } = req.body;
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
            problemCreator: req.user._id
        });

        res.status(201).json({ message: "Problem created successfully", problem: userProblem });
    }
    catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Error creating problem",
            error: err.message,
        });
    }
};

const updateProblem = async (req, res) => {
    try {
        const { title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, referenceSolution, problemCreator } = req.body;
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                message: "Problem id is required"
            });
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
                    return res.status(400).json({ message: test.status.description });
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

        const problem = await problemModel.findById(problemId);

        if (!problem) {
            return res.status(404).json({
                message: "Problem not found"
            });
        }

        const response = {
            _id: problem._id,
            title: problem.title,
            description: problem.description,
            difficulty: problem.difficulty,
            tags: problem.tags,
            visibleTestCases: problem.visibleTestCases,
            startCode: problem.startCode,
            referenceSolution: problem.referenceSolution,
            hiddenTestCasesCount: problem.hiddenTestCases.length
        };

        res.status(200).json(response);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching problem", error: err.message });
    }
};

const getProblemsByUser = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await userModel.findById(userId).populate({
            path: 'problemSolved',
            select: '_id title difficulty tags'
        });


        res.status(200).send(user.problemSolved);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching problems", error: err.message });
    }
};

const submittedProblem = async (req, res) => {
    try {
        const userId = req.user._id;
        const problemId = req.params.pid;

        const answer = await Submission.find({ userId, problemId });
        if (answer.length === 0) {
            return res.status(404).json({ message: "No submission found for this problem by the user" });
        }
        res.status(200).json(answer);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching submitted problem", error: err.message });
    }
}

module.exports = {
    createProblem,
    updateProblem,
    deleteProblem,
    getProblems,
    getAllProblems,
    getProblemsByUser,
    submittedProblem
};