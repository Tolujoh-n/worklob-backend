const express = require("express");
const Chat = require("../models/Chat");
const FullTimeJob = require("../models/FullTimeJob");
const FreelanceJob = require("../models/FreelancingJob");
const PostGig = require("../models/postgig");
const Application = require("../models/ApplicationSchema");
const GigApply = require("../models/GigApplication");

const router = express.Router();

router.get("/getAllchats", async (req, res) => {
  try {
    const chat = await Chat.find({});
    return res.status(200).json(chat);
  } catch (error) {
    console.error("Error fetching jobs:", error.message);
    return res.status(500).json({
      msg: "Error occurred while fetching gigs",
      error: error.message,
    });
  }
});

router.get("/chatdetails/:jobId/chat/:chatId", async (req, res) => {
  const { jobId, chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId)
      .populate("customerId", "username")
      .populate("talentId", "username");

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    console.log(chat); // Optional: for debugging

    res.status(200).json(chat);
  } catch (error) {
    console.error("Error fetching job details:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.put("/chatdetails/:jobId/chat/:chatId", async (req, res) => {
  const { chatId } = req.params;
  const { walletAddress, status, userId, userRole } = req.body;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Log user details for debugging
    console.log("User Role:", userRole);
    console.log("User ID:", userId);
    console.log("Customer ID:", chat.customerId);
    console.log("Talent ID:", chat.talentId);

    // Check walletAddress before updating status
    if (!chat.walletAddress && !walletAddress) {
      return res.status(400).json({
        message: "Wallet address is required before updating status.",
      });
    }

    if (walletAddress) {
      chat.walletAddress = walletAddress;
    }

    // Validate status transition
    const validTransitions = {
      applied: "offered",
      offered: "deposited",
      deposited: "inProgress",
      inProgress: "completed",
      completed: "confirmed",
    };

    if (status && validTransitions[chat.status] !== status) {
      return res.status(400).json({
        message: `Invalid status transition. Status can only be updated from ${
          chat.status
        } to ${validTransitions[chat.status]}.`,
      });
    }

    // Role and ID checks for each status
    if (
      status === "offered" ||
      status === "deposited" ||
      status === "confirmed"
    ) {
      if (userRole !== "Customer") {
        return res
          .status(403)
          .json({ message: "Switch to Customer role to perform this action." });
      }
      if (userId !== chat.customerId.toString()) {
        return res.status(403).json({ message: "You are not the Customer." });
      }
    } else if (status === "inProgress" || status === "completed") {
      if (userRole !== "Talent") {
        return res
          .status(403)
          .json({ message: "Switch to Talent role to perform this action." });
      }
      if (userId !== chat.talentId.toString()) {
        return res.status(403).json({ message: "You are not the Talent." });
      }
    }

    // Update the status
    if (status) {
      chat.status = status;
    }

    await chat.save();
    res.status(200).json({ message: "Chat updated successfully", chat });
  } catch (error) {
    console.error("Error updating chat details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/chatdetails", async (req, res) => {
  const { jobId } = req.query;
  try {
    const chatData = await Chat.find({ jobId: jobId });
    console.log(chatData);
    if (chatData.length > 0) {
      return res.status(200).json(chatData);
    }
    return res.status(404).json({ message: "ChatId not found" });
  } catch (error) {
    console.error("Error fetching Chat details:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
router.get("/allchats/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch chats involving the user
    const findChats = await Chat.find({
      $or: [{ receiver: userId }, { sender: userId }],
    })
      .sort({ createdAt: -1 })
      .populate("sender", "username")
      .populate("receiver", "username")
      .populate("customerId", "username")
      .populate("talentId", "username");

    // Helper function to populate job title based on job type
    const populateJobTitle = async (chat) => {
      switch (chat.jobType) {
        case "FullTimeJob":
          const fullTimeJob = await FullTimeJob.findById(chat.jobId);
          return fullTimeJob ? fullTimeJob.jobTitle : null;
        case "FreelanceJob":
          const freelanceJob = await FreelanceJob.findById(chat.jobId);
          return freelanceJob ? freelanceJob.jobTitle : null;
        case "GigJob":
          const gigJob = await PostGig.findById(chat.jobId);
          return gigJob ? gigJob.jobTitle : null;
        default:
          return null;
      }
    };

    // Fetch userRole from Application or GigApply model
    const getUserRole = async (chat) => {
      let application;
      if (chat.jobType === "FullTimeJob" || chat.jobType === "FreelanceJob") {
        application = await Application.findOne({
          jobId: chat.jobId,
          applicant: chat.sender._id,
        });
      } else if (chat.jobType === "GigJob") {
        const gigApply = await GigApply.findOne({
          jobId: chat.jobId,
          applicant: chat.sender._id,
        });
        return gigApply ? gigApply.userRole : "Unknown";
      }
      return application ? application.userRole : "Unknown";
    };

    // Populate job titles and userRoles for each chat
    const chatsWithDetails = await Promise.all(
      findChats.map(async (chat) => {
        const jobTitle = await populateJobTitle(chat);
        const applicantRole = await getUserRole(chat);
        return { ...chat.toObject(), jobTitle, applicantRole };
      })
    );

    res.status(200).json(chatsWithDetails);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ message: "Error fetching chats" });
  }
});

module.exports = router;
