const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const PostGig = require("../models/postgig");
const GigApply = require("../models/GigApplication");
const router = express.Router();
const Chat = require("../models/Chat");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/buyGig", upload.single("cvFile"), async (req, res) => {
  try {
    const { jobId, applicantId, description, userRole } = req.body;

    if (!jobId || !applicantId || !description || !userRole) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (!req.file) {
      return res.status(400).json({ error: "CV file is required." });
    }

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: "Invalid jobId format." });
    }

    const gigJob = await PostGig.findById(jobId).populate("postedBy");
    const receiverId = gigJob.postedBy;

    const newApplication = new GigApply({
      jobId,
      applicant: applicantId,
      description,
      cvFile: req.file.path,
      userRole,
    });

    const savedApplication = await newApplication.save();

    const newChat = new Chat({
      jobId,
      sender: applicantId,
      jobType: "GigJob",
      receiver: receiverId,
      message: `Application: ${description}`,
      isRead: false,
      userRole,
      customerId: applicantId,
      talentId: receiverId,
    });

    const savedChat = await newChat.save();

    res.status(200).json({
      message: "BuyGig successfully",
      application: savedApplication,
      chatId: savedChat._id,
    });
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).json({
      error: "Failed to submit application. Please try again later.",
      details: error.message,
    });
  }
});

router.get("/getAllBuyGig", async (req, res) => {
  try {
    const application = await GigApply.find({});
    return res.status(200).json(application);
  } catch (error) {
    console.error("Error fetching jobs:", error.message);
    return res.status(500).json({
      msg: "Error occurred while fetching gigs",
      error: error.message,
    });
  }
});

router.get("/buy-gigjobs/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("User ID:", userId);

    const applications = await GigApply.find({
      applicant: userId,
    })
      .populate({
        path: "jobId",
        model: "PostGig",
        populate: {
          path: "postedBy",
          select: "username",
        },
      })
      .exec();

    console.log("Applications with populated GigJob IDs:", applications);

    const appliedJobs = applications.map((application) => ({
      jobDetails: application.jobId,
      application,
    }));

    res.status(200).json({ appliedJobs });
  } catch (error) {
    console.error("Error fetching buy gig jobs:", error.message);
    res.status(500).json({ error: "Error fetching buygig jobs " });
  }
});

module.exports = router;
