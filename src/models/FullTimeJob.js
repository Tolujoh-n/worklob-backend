const mongoose = require('mongoose');

const fullTimeJobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true
  },
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time'],
    required: true
  },
  workplaceType: {
    type: String,
    enum: ['Remote', 'Hybrid', 'Office'],
    required: true
  },
  role: {
    type: String,
    required: true
  },
  selectedSkills: [{
    type: String
  }],
  workExperience: {
    type: String,
    enum: ['1 year', '1-3 years', '3+ years'],
    required: true
  },
  compensationType: {
    type: String, 
    required: true
  },
  compensationMode: {
    type: String, 
    required: true
  },
  fixedCompensation: {
    type: Number,
    required: function () {
      return this.compensationMode === 'Fixed';
    }
  },
  rangeCompensation: {
    min: {
      type: Number,
      required: function () {
        return this.compensationMode === 'Range';
      }
    },
    max: {
      type: Number,
      required: function () {
        return this.compensationMode === 'Range';
      }
    }
  },
  description: {
    type: String,
    required: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const FullTimeJob = mongoose.model('FullTimeJob', fullTimeJobSchema);
module.exports = FullTimeJob;
