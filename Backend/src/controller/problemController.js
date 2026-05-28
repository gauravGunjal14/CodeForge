const problemModel = require('../models/problemModel');
const userModel = require('../models/UserModel');

const createProblem = async (req, res) => {
    try {
        const problem = new problemModel(req.body);
        await problem.save();
        res.status(201).json({ message: "Problem created successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Error creating problem", error: err.message });
    }
};

const updateProblem = async (req, res) => {
    try {
        const problemId = req.params.id;
        const updatedProblem = await problemModel.findByIdAndUpdate(problemId, req.body, { new: true });
        if (!updatedProblem) {
            return res.status(404).json({ message: "Problem not found" });
        }
        res.status(200).json({ message: "Problem updated successfully", problem: updatedProblem });
    }
    catch (err) {
        res.status(500).json({ message: "Error updating problem", error: err.message });
    }
};

const deleteProblem = async (req, res) => {
    try{
        const problemId = req.params.id;
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
        const problems = await problemModel.find();
        res.status(200).json(problems);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching problems", error: err.message });
    }
};

const getProblems = async (req, res) => {
    try {
        const problemId = req.params.id;
        const problem = await problemModel.findById(problemId);
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
        const { userId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({message: "Invalid user id"});
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        res.status(200).json({problemsSolved: user.problemSolved});

    } 
    catch (err) {
        res.status(500).json({message: "Error fetching problems",error: err.message});
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