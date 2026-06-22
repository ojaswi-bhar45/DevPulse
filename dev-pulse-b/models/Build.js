const mongoose = require("mongoose");

const buildSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    repo: { type: String, required: true },
    owner: { type: String, required: true },
    branch: { type: String, default: "main" },
    runNumber: { type: Number, required: true },
    commitMessage: { type: String, default: "" },
    status: {
      type: String,
      enum: ["passed", "failed", "running", "skipped"],
      required: true,
      index: true,
    },
    duration: { type: String, default: "00:00:00" },
    triggeredAt: { type: Date, default: Date.now },
    githubRunId: { type: Number, required: true, unique: true },
  },
  { timestamps: true }
);

buildSchema.index({ userId: 1, status: 1 });
buildSchema.index({ userId: 1, triggeredAt: -1 });

module.exports = mongoose.model("Build", buildSchema);
