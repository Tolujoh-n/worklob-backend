const mongoose = require('mongoose');

const freelanceJobSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    selectedSkills: [{
        type: String,
        required: true
    }],
    fileList: {
        type: [String], 
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const FreelanceJob = mongoose.model('FreelanceJob', freelanceJobSchema);
module.exports = FreelanceJob;
