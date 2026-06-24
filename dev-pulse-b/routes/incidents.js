const express = require("express");
const Incident = require("../models/Incident");
const { validate } = require("../middleware/validate.js");
const { createIncidentSchema, updateIncidentSchema } = require("../validators/incident.js");

const router = express.Router();

const warnedIncidents = new Set();

async function checkSLAWarnings() {
  try {
    const { io } = require("../index.js");
    const now = Date.now();
    const incidents = await Incident.find({ status: { $ne: "resolved" } }).lean();
    for (const inc of incidents) {
      const elapsed = Math.floor((now - new Date(inc.createdAt).getTime()) / 60000);
      const ratio = elapsed / inc.slaMinutes;
      if (ratio >= 0.8 && !warnedIncidents.has(inc._id.toString())) {
        warnedIncidents.add(inc._id.toString());
        const mapped = mapIncident(inc);
        io.to(inc.userId.toString()).emit("incident:sla-warning", mapped);
      }
    }
  } catch { /* silent */ }
}

setInterval(checkSLAWarnings, 30000);

function computeElapsedMinutes(createdAt) {
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
}

function mapIncident(doc) {
  const inc = { ...doc };
  inc.id = inc._id.toString();
  delete inc._id;
  delete inc.__v;
  inc.elapsedMinutes = computeElapsedMinutes(inc.createdAt);
  inc.timeline = (inc.timeline || []).map((entry) => ({
    ...entry,
    id: entry._id ? entry._id.toString() : undefined,
  }));
  inc.timeline.forEach((entry) => delete entry._id);
  return inc;
}

router.get("/incidents", async (req, res) => {
  try {
    const { page = "1", pageSize = "10", status, severity } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(pageSize, 10) || 10));

    const filter = { userId: req.user._id };
    if (status && status !== "all") filter.status = status;
    if (severity && severity !== "all") filter.severity = severity;

    const [total, incidents] = await Promise.all([
      Incident.countDocuments(filter),
      Incident.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    res.json({
      incidents: incidents.map(mapIncident),
      total,
      page: pageNum,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Fetch incidents error:", err);
    res.status(500).json({ message: "Failed to fetch incidents" });
  }
});

router.get("/incidents/:id", async (req, res) => {
  try {
    const incident = await Incident.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).lean();

    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    res.json(mapIncident(incident));
  } catch (err) {
    console.error("Fetch incident error:", err);
    res.status(500).json({ message: "Failed to fetch incident" });
  }
});

router.post("/incidents", validate(createIncidentSchema), async (req, res) => {
  try {
    const data = req.validated;
    const incident = await Incident.create({
      userId: req.user._id,
      title: data.title,
      severity: data.severity,
      assignee: data.assignee || "",
      slaMinutes: data.slaMinutes,
      timeline: [
        {
          action: "created",
          user: req.user.name || req.user.email,
          timestamp: new Date(),
          details: `Incident created with ${data.severity} severity`,
        },
      ],
    });

    const plain = incident.toObject();
    const mapped = mapIncident(plain);

    const io = require("../index.js").io;
    io.to(req.user._id.toString()).emit("incident:created", mapped);

    res.status(201).json(mapped);
  } catch (err) {
    console.error("Create incident error:", err);
    res.status(500).json({ message: "Failed to create incident" });
  }
});

router.patch("/incidents/:id", validate(updateIncidentSchema), async (req, res) => {
  try {
    const data = req.validated;
    const incident = await Incident.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    const timelineEntries = [];
    const userName = req.user.name || req.user.email;

    if (data.status && data.status !== incident.status) {
      timelineEntries.push({
        action: "status_changed",
        user: userName,
        timestamp: new Date(),
        details: `Status changed from ${incident.status} to ${data.status}`,
      });
      incident.status = data.status;
    }

    if (data.assignee !== undefined && data.assignee !== incident.assignee) {
      timelineEntries.push({
        action: "assignee_changed",
        user: userName,
        timestamp: new Date(),
        details: incident.assignee
          ? `Assignee changed from ${incident.assignee} to ${data.assignee}`
          : `Assigned to ${data.assignee}`,
      });
      incident.assignee = data.assignee;
    }

    if (data.comment) {
      timelineEntries.push({
        action: "comment",
        user: userName,
        timestamp: new Date(),
        details: data.comment,
      });
    }

    if (timelineEntries.length > 0) {
      incident.timeline.push(...timelineEntries);
    }

    await incident.save();

    const plain = incident.toObject();
    const mapped = mapIncident(plain);

    const io = require("../index.js").io;
    io.to(req.user._id.toString()).emit("incident:updated", mapped);

    const slaRatio = mapped.elapsedMinutes / mapped.slaMinutes;
    if (slaRatio >= 0.8) {
      warnedIncidents.add(mapped.id);
      io.to(req.user._id.toString()).emit("incident:sla-warning", mapped);
    }

    res.json(mapped);
  } catch (err) {
    console.error("Update incident error:", err);
    res.status(500).json({ message: "Failed to update incident" });
  }
});

module.exports = router;
