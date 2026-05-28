const mongoose = require('mongoose');
const { Schema } = mongoose;

const problemSchema = new Schema({
    title: {
        type: String,
        reqired: true
    },
    description: {
        type: String,
        reqired: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        reqired: true
    },
    tags: {
        type: String,
        enum: ['Array', 'String', 'Linked List', 'Tree', 'Graph', 'Dynamic Programming', 'Backtracking', 'Greedy', 'Sorting', 'Searching'],
        reqired: true
    },
    visibleTestCases: [
        {
            input: {
                type: String,
                reqired: true
            },
            output: {
                type: String,
                reqired: true
            },
            explanation: {
                type: String,
                reqired: true
            }
        }],
    hiddenTestCases: [
        {
            input: {
                type: String,
                reqired: true
            },
            output: {
                type: String,
                reqired: true
            }
        }],
    startCode: [
        {
            language: {
                type: String,
                enum: ['JavaScript', 'Python', 'Java', 'C++', 'C#'],
                reqired: true
            },
            initialCode: {
                type: String,
                reqired: true
            }
        }
    ],
    problemCreator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        reqired: true
    } 

});

const problemModel = mongoose.model('Problem', problemSchema);

module.exports = problemModel;