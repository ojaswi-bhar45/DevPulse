const express = require("express");
const Build = require("../models/Build");

const router = express.Router();

router.get("/builds", async (req, res) => {
  try {
    const { page = "1", pageSize = "10", status = "all" } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(pageSize, 10) || 10));

    const filter = { userId: req.user._id };
    if (status !== "all") {
      filter.status = status;
    }

    const [total, builds] = await Promise.all([
      Build.countDocuments(filter),
      Build.find(filter)
        .sort({ triggeredAt: -1 })
        .skip((pageNum - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    res.json({
      builds,
      total,
      page: pageNum,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Fetch builds error:", err);
    res.status(500).json({ message: "Failed to fetch builds" });
  }
});

module.exports = router;
