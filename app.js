global.crypto = require("crypto").webcrypto;

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const rootRouter = require("./src/router/index");
const User = require("./src/models/User");
const cookieParser = require("cookie-parser");
const FullTimeJob = require("./src/models/FullTimeJob");
const cron = require("node-cron");
const { updateEthPrice } = require("./src/router/ethPrice");

// Update ETH price every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  console.log("Updating ETH price from CoinGecko...");
  await updateEthPrice();
});

// Fetch once on startup
updateEthPrice();

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["https://worklobapp.netlify.app", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(cookieParser());

mongoose
  .connect(
    "mongodb+srv://tolujohnofficial:sdc3CQEtFuwsYTtE@worklob.p3q3s.mongodb.net/?retryWrites=true&w=majority&appName=worklob",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 50000, // Increase to 50 seconds
      socketTimeoutMS: 45000, // Increase to 45 seconds
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Mongoose connection error: ", err));

app.get("/allUsers", async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.status(200).json(users);
  } catch (e) {
    console.error("Error fetching users:", e.message);
    res
      .status(500)
      .json({ msg: "Error occurred while fetching users", error: e.message });
  }
});

app.use("/api/v1", rootRouter);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
