const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, required: true },
  jobType: {
    type: String,
    enum: ["FullTimeJob", "FreelanceJob", "GigJob"],
    required: true,
  },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  talentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  walletAddress: { type: String, required: false },
  status: {
    type: String,
    enum: [
      "applied",
      "offered",
      "deposited",
      "inProgress",
      "completed",
      "confirmed",
    ],
    default: "applied",
  }, // New field
});

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
