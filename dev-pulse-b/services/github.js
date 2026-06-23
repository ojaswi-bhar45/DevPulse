const GH_API = "https://api.github.com";
const GH_AUTH = "https://github.com/login/oauth";

async function exchangeCodeForToken(code) {
  const res = await fetch(`${GH_AUTH}/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
    }),
  });

  if (!res.ok) {
    throw new Error(`Token exchange failed: ${res.status}`);
  }

  const data = await res.json();
  if (data.error) {
    throw new Error(`GitHub OAuth error: ${data.error_description || data.error}`);
  }

  return data.access_token;
}

async function fetchGitHubUser(accessToken) {
  const res = await fetch(`${GH_API}/user`, {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github.v3+json" },
  });
  if (!res.ok) throw new Error(`Failed to fetch GitHub user: ${res.status}`);
  const data = await res.json();
  return { id: data.id, login: data.login, avatar: data.avatar_url };
}

async function fetchUserRepos(accessToken) {
  const repos = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const res = await fetch(`${GH_API}/user/repos?per_page=100&page=${page}&sort=updated`, {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github.v3+json" },
    });
    if (!res.ok) throw new Error(`Failed to fetch repos: ${res.status}`);
    const data = await res.json();
    repos.push(...data);
    hasMore = data.length === 100;
    page++;
  }

  return repos;
}

async function fetchWorkflowRuns(accessToken, owner, repo) {
  const res = await fetch(`${GH_API}/repos/${owner}/${repo}/actions/runs?per_page=30`, {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github.v3+json" },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.workflow_runs || [];
}

async function fetchBranches(accessToken, owner, repo) {
  const res = await fetch(`${GH_API}/repos/${owner}/${repo}/branches?per_page=30`, {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/vnd.github.v3+json" },
  });
  if (!res.ok) return 1;
  const data = await res.json();
  return Array.isArray(data) ? data.length : 1;
}

function mapRunStatus(githubStatus, conclusion) {
  if (githubStatus === "queued" || githubStatus === "in_progress") return "running";
  if (githubStatus === "completed") {
    if (conclusion === "success") return "passed";
    if (conclusion === "failure" || conclusion === "timed_out" || conclusion === "startup_failure") return "failed";
    return "skipped";
  }
  return "skipped";
}

function computeDuration(startedAt, completedAt) {
  if (!startedAt || !completedAt) return "00:00:00";
  const diff = new Date(completedAt).getTime() - new Date(startedAt).getTime();
  if (diff <= 0) return "00:00:00";
  const totalSec = Math.floor(diff / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

async function syncUserData(user) {
  const Build = require("../models/Build");
  const Repo = require("../models/Repo");
  const { io } = require("../index");

  const token = user.githubAccessToken;
  if (!token) throw new Error("GitHub not connected");

  const repos = await fetchUserRepos(token);
  let repoCount = 0;
  let buildCount = 0;

  for (const ghRepo of repos) {
    const branchCount = await fetchBranches(token, ghRepo.owner.login, ghRepo.name);

    const buildHistory = [];
    const runs = await fetchWorkflowRuns(token, ghRepo.owner.login, ghRepo.name);

    for (const run of runs) {
      const status = mapRunStatus(run.status, run.conclusion);
      const duration = computeDuration(run.run_started_at, run.updated_at);

      try {
        const build = await Build.findOneAndUpdate(
          { githubRunId: run.id },
          {
            userId: user._id,
            repo: ghRepo.name,
            owner: ghRepo.owner.login,
            branch: run.head_branch || ghRepo.default_branch,
            runNumber: run.run_number,
            commitMessage: run.head_commit?.message || "",
            status,
            duration,
            triggeredAt: run.run_started_at || run.created_at,
            githubRunId: run.id,
          },
          { upsert: true, returnDocument: 'after' }
        );
        io.to(user._id.toString()).emit("build:updated", build.toObject());
        buildCount++;
      } catch {
        // skip duplicates
      }
    }

    const recentBuilds = await Build.find({ userId: user._id, repo: ghRepo.name })
      .sort({ triggeredAt: -1 })
      .limit(10)
      .lean();

    for (const b of recentBuilds) {
      buildHistory.push(b.status === "passed" ? "passed" : "failed");
    }

    try {
      await Repo.findOneAndUpdate(
        { userId: user._id, githubId: ghRepo.id },
        {
          name: ghRepo.name,
          fullName: ghRepo.full_name,
          language: ghRepo.language || "Unknown",
          defaultBranch: ghRepo.default_branch,
          branches: branchCount,
          buildHistory,
        },
        { upsert: true, returnDocument: 'after' }
      );
      repoCount++;
    } catch {
      // skip duplicates
    }
  }

  return { repos: repoCount, builds: buildCount };
}

module.exports = {
  exchangeCodeForToken,
  fetchGitHubUser,
  fetchUserRepos,
  fetchWorkflowRuns,
  fetchBranches,
  mapRunStatus,
  computeDuration,
  syncUserData,
};
