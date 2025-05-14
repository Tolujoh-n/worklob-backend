// models/ApplicationSchema.js
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "jobType",
    },
    jobType: {
      type: String,
      required: true,
      enum: ["FullTimeJob", "FreelanceJob"],
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["USDT", "ETH"],
      required: true,
    },
    cvFile: {
      type: String,
      default: [],
      // Store the file path or filename
    },
    description: {
      type: String,
      required: true,
    },
    userRole: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;
