const mongoose = require("mongoose");

const repoSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    githubId: { type: Number, required: true },
    name: { type: String, required: true },
    fullName: { type: String, required: true },
    language: { type: String, default: "Unknown" },
    defaultBranch: { type: String, default: "main" },
    branches: { type: Number, default: 1 },
    buildHistory: [{ type: String, enum: ["passed", "failed"] }],
  },
  { timestamps: true }
);

repoSchema.index({ userId: 1, githubId: 1 }, { unique: true });

module.exports = mongoose.model("Repo", repoSchema);
