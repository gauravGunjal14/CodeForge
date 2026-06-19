const problemModel = require('../models/problemModel');
const submission = require('../models/submissionModel');
const userModel = require('../models/userModel');
const { getLanguageById, submitBatch, submitToken } = require('../utils/problemUtility');

const submitController = async (req, res) => {
    try {
        const userId = req.user._id;
        const problemId = req.params.id;

        const { code, language } = req.body;

        if (!userId || !problemId || !code || !language) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // fetch the problem details from the database
        const problem = await problemModel.findById(problemId);
        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }

        // create a new submission in the database with status 'pending'
        const newSubmission = await submission.create({
            userId,
            problemId,
            code,
            language,
            status: 'pending',
            totalTestCases: problem.testCases.length
        });

        // judge0 API integration to evaluate the submission
        const languageId = getLanguageById(language);

        const submissions = problem.hiddenTestCases.map((testCase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testCase.input,
            expected_output: testCase.output
        }));

        console.log(JSON.stringify(submissions, null, 2));

        const submitResults = await submitBatch(submissions);

        const resultToken = submitResults.map((result) => result.token);

        const testResult = await submitToken(resultToken);

        // update the submission status and results in the database
        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let errorMessage = null;

        for (const test of testResult) {
            if (test.status.id === 3) {
                testCasesPassed++;
                runtime = runtime + parseFloat(test.time);
                memory = Math.max(memory, test.memory);
            }
            else {
                if (test.status.id === 4) {
                    status = 'error';
                    errorMessage = test.stderr;
                }
                else {
                    status = 'wrong';
                    errorMessage = test.stderr;
                }
            }
        }

        // update the submission status based on the test results
        newSubmission.status = status;
        newSubmission.testCasesPassed = testCasesPassed;
        newSubmission.runtime = runtime;
        newSubmission.memory = memory;
        newSubmission.errorMessage = errorMessage;

        await newSubmission.save();

        // upadate the user's submission history

        if (!req.user.problemSolved.includes(problemId)) {
            req.user.problemSolved.push(problemId);
            await req.user.save();
        }

        res.status(201).json({ message: "Submission created successfully", submission: newSubmission });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const runCode = async (req, res) => {
    try {
        const userId = req.user._id;
        const problemId = req.params.id;

        const { code, language } = req.body;

        if (!userId || !problemId || !code || !language) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // fetch the problem details from the database
        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }


        // judge0 API integration to evaluate the submission
        const languageId = getLanguageById(language);

        const submissions = problem.visibleTestCases.map((testCase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testCase.input,
            expected_output: testCase.output
        }));

        const submitResults = await submitBatch(submissions);

        const resultToken = submitResults.map((result) => result.token);

        const testResult = await submitToken(resultToken);

        res.status(201).send(testResult);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {submitController, runCode};