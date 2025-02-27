const express = require("express");
const mongoose = require("mongoose");
const PostGig = require("../models/postgig");
const Chat = require('../models/Chat');

const router = express.Router();

router.use(express.json());

router.post("/postgig", async (req, res) => {
  const { jobTitle, description, selectedSkills, fileList, budget, userId } =
    req.body;
  console.log({
    jobTitle,
    description,
    selectedSkills,
    fileList,
    budget,
    userId,
  });
  if (!jobTitle || !description || !selectedSkills || !budget || !userId) {
    return res.status(400).json({ error: "All fields are required." });
  }
  try {
    const newJob = new PostGig({
      jobTitle,
      description,
      selectedSkills,
      fileList,
      budget,
      postedBy: userId,
    });

    const savedJob = await newJob.save();
    return res
      .status(200)
      .json({ message: "Gig Job posted successfully", job: savedJob });
  } catch (error) {
    console.error("Database error:", error);
    return res
      .status(500)
      .json({ error: "Failed to post job. Please try again later." });
  }
});

router.get("/getAllGigJob", async (req, res) => {
  try {
    const jobs = await PostGig.find({}).populate("postedBy", "username");
    return res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error.message);
    return res
      .status(500)
      .json({
        msg: "Error occurred while fetching gigs",
        error: error.message,
      });
  }
});

router.get("/userGigs/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format." });
    }

    const userGigs = await PostGig.find({ postedBy: userId }).populate(
      "postedBy",
      "username"
    );
    return res.status(200).json(userGigs);
  } catch (error) {
    console.error("Error fetching user gigs:", error.message);
    return res
      .status(500)
      .json({ error: "Failed to fetch user gigs. Please try again later." });
  }
});

module.exports = router;
