const mongoose = require("mongoose");

const timelineEntrySchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    user: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    details: { type: String, default: "" },
  },
  { _id: true }
);

const incidentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    severity: {
      type: String,
      enum: ["P1", "P2", "P3"],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["open", "investigating", "resolved"],
      default: "open",
      index: true,
    },
    assignee: { type: String, default: "" },
    slaMinutes: { type: Number, required: true, min: 1 },
    timeline: [timelineEntrySchema],
    aiSuggestion: { type: String, default: "" },
  },
  { timestamps: true }
);

incidentSchema.index({ userId: 1, status: 1 });
incidentSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Incident", incidentSchema);
