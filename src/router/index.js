const express = require("express");
const router = express.Router();
const userRouter = require("./user");
const jobRouter = require("./fulltimeJob");
const freelanceJobRouter = require("./freelanceJob");
const gigRouter = require("./gigJob");
const applyJobRouter = require("./applyjob");
const buyGigRouter = require("./buyGig");
const chatRouter = require("./chatRouter");
const profileRouter = require("./Profile");
const z = require("zod");

router.use("/user", userRouter);
router.use("/jobs", jobRouter);
router.use("/frjobs", freelanceJobRouter);
router.use("/gigJob", gigRouter);
router.use("/application", applyJobRouter, buyGigRouter);
router.use("/chat", chatRouter);
router.use("/profile", profileRouter);

module.exports = router;
