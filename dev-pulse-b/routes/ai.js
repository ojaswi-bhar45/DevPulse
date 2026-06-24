const express = require("express");
const PRSummary = require("../models/PRSummary");
const User = require("../models/User");
const { addPRSummaryJob } = require("../services/queue");
const github = require("../services/github");
const { validate } = require("../middleware/validate");
const { generateAISchema } = require("../validators/ai");

const router = express.Router();

function mapSummary(doc) {
  return {
    id: doc._id.toString(),
    type: doc.type,
    title: doc.title,
    body: doc.body,
    riskLevel: doc.riskLevel,
    createdAt: doc.createdAt,
  };
}

router.get("/ai/summaries", async (req, res) => {
  try {
    const { page = "1", pageSize = "10", type = "all" } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(pageSize, 10) || 10));

    const filter = { userId: req.user._id };
    if (type && type !== "all") filter.type = type;

    const [total, summaries] = await Promise.all([
      PRSummary.countDocuments(filter),
      PRSummary.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    res.json({
      summaries: summaries.map(mapSummary),
      total,
      page: pageNum,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Fetch AI summaries error:", err);
    res.status(500).json({ message: "Failed to fetch summaries" });
  }
});

router.post("/ai/generate", validate(generateAISchema), async (req, res) => {
  try {
    const { repo, owner, prNumber } = req.validated;

    const user = await User.findById(req.user._id).select("+githubAccessToken");
    if (!user.githubAccessToken) {
      return res.status(400).json({ message: "GitHub not connected" });
    }

    const existing = await PRSummary.findOne({
      userId: user._id,
      prNumber,
      repo,
      owner,
    });
    if (existing) {
      return res.status(409).json({ message: "Summary already exists for this PR" });
    }

    const prInfo = await github.fetchPRInfo(user.githubAccessToken, owner, repo, prNumber);

    await addPRSummaryJob({
      userId: user._id.toString(),
      repo,
      owner,
      prNumber,
      prTitle: prInfo.title,
      prUrl: prInfo.html_url,
      accessToken: user.githubAccessToken,
    });

    res.status(202).json({ message: "Summary generation queued" });
  } catch (err) {
    console.error("Generate AI summary error:", err);
    res.status(500).json({ message: "Failed to queue summary generation" });
  }
});

module.exports = router;
