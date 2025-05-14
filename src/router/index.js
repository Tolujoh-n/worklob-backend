const express = require("express");
const router = express.Router();
const userRouter = require("./user");
const jobRouter = require("./fulltimeJob");
const freelanceJobRouter = require("./freelanceJob");
const gigRouter = require("./gigJob");
const applyJobRouter = require("./applyjob");
const buyGigRouter = require("./buyGig");
const chatRouter = require("./chatRouter");
const AI_imageRouter = require("./ai-generate-image");
const profileRouter = require("./Profile");
const ethPrice = require("./ethPrice");
const z = require("zod");

router.use("/user", userRouter);
router.use("/jobs", jobRouter);
router.use("/frjobs", freelanceJobRouter);
router.use("/gigJob", gigRouter);
router.use("/application", applyJobRouter, buyGigRouter);
router.use("/chat", chatRouter);
router.use("/ai_image", AI_imageRouter);
router.use("/profile", profileRouter);
router.use("/price", ethPrice.router);

module.exports = router;
