const { z } = require("zod");

const createIncidentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  severity: z.enum(["P1", "P2", "P3"]),
  assignee: z.string().optional(),
  slaMinutes: z.number().int("SLA must be a whole number").min(1, "SLA must be at least 1 minute"),
});

const updateIncidentSchema = z.object({
  status: z.enum(["open", "investigating", "resolved"]).optional(),
  assignee: z.string().optional(),
  comment: z.string().optional(),
});

module.exports = { createIncidentSchema, updateIncidentSchema };
