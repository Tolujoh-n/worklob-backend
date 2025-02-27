// models/Application.js
const mongoose = require("mongoose");

const gigApplySchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    cvFile: {
      type: String,
      default: [],
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

const GigApply = mongoose.model("GigApply", gigApplySchema);
module.exports = GigApply;
