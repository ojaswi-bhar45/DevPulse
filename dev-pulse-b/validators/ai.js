const { z } = require("zod");

const generateAISchema = z.object({
  repo: z.string().min(1, "repo is required"),
  owner: z.string().min(1, "owner is required"),
  prNumber: z.number().int("prNumber must be an integer").positive("prNumber must be positive"),
});

module.exports = { generateAISchema };
