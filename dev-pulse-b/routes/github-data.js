const express = require("express");
const User = require("../models/User");
const Repo = require("../models/Repo");
const github = require("../services/github");

const router = express.Router();

router.get("/status", async (req, res) => {
  const user = await User.findById(req.user._id).select("+githubAccessToken");
  res.json({
    connected: !!user.githubId,
    username: user.githubUsername || null,
    avatar: user.avatar || null,
  });
});

router.post("/sync", async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+githubAccessToken");
    if (!user.githubAccessToken) {
      return res.status(400).json({ message: "GitHub not connected" });
    }
    const result = await github.syncUserData(user);
    res.json({ message: "Sync complete", ...result });
  } catch (err) {
    console.error("Sync error:", err);
    res.status(500).json({ message: "Sync failed" });
  }
});

router.get("/repos", async (req, res) => {
  try {
    const repos = await Repo.find({ userId: req.user._id }).sort({ name: 1 }).lean();
    res.json({ repos });
  } catch (err) {
    console.error("Fetch repos error:", err);
    res.status(500).json({ message: "Failed to fetch repos" });
  }
});

module.exports = router;
