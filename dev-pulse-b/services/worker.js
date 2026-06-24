const { Worker } = require("bullmq");
const { connection } = require("./queue");
const github = require("./github");
const ai = require("./ai");
const PRSummary = require("../models/PRSummary");

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

function startWorker(io) {
  const worker = new Worker(
    "ai-summaries",
    async (job) => {
      const { userId, repo, owner, prNumber, prTitle, prUrl, accessToken } = job.data;

      console.log(`Processing AI summary for ${owner}/${repo}#${prNumber}`);

      const diff = await github.fetchPRDiff(accessToken, owner, repo, prNumber);

      const result = await ai.generatePRSummary(diff, prTitle);

      const summary = await PRSummary.create({
        userId,
        repo,
        owner,
        prNumber,
        prTitle,
        prUrl,
        type: "pr",
        title: `${prTitle} — AI Review`,
        body: `${result.summary}\n\n**Review Notes:** ${result.reviewNotes}`,
        riskLevel: result.riskLevel,
      });

      const plain = summary.toObject();
      const mapped = mapSummary(plain);
      io.to(userId).emit("ai:summary-created", mapped);

      console.log(`AI summary complete for ${owner}/${repo}#${prNumber}`);
    },
    { connection }
  );

  worker.on("failed", (job, err) => {
    console.error(`AI worker job ${job?.id} failed:`, err.message);
  });

  return worker;
}

module.exports = { startWorker };
