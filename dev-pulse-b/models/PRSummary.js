const mongoose = require("mongoose");

const prSummarySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    repo: { type: String, required: true },
    owner: { type: String, required: true },
    prNumber: { type: Number, required: true },
    prTitle: { type: String, required: true },
    prUrl: { type: String, default: "" },
    type: { type: String, enum: ["pr", "incident"], default: "pr" },
    title: { type: String, required: true },
    body: { type: String, required: true },
    riskLevel: { type: String, enum: ["low", "medium", "high"], required: true },
  },
  { timestamps: true }
);

prSummarySchema.index({ userId: 1, createdAt: -1 });
prSummarySchema.index({ userId: 1, type: 1 });
prSummarySchema.index({ userId: 1, prNumber: 1, repo: 1, owner: 1 }, { unique: true });

module.exports = mongoose.model("PRSummary", prSummarySchema);
