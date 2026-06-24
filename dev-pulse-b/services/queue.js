const { Queue } = require("bullmq");
const Redis = require("ioredis");

const connection = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

const aiQueue = new Queue("ai-summaries", { connection });

async function addPRSummaryJob(data) {
  return aiQueue.add("generate-summary", data, {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
  });
}

module.exports = { aiQueue, addPRSummaryJob, connection };
