const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const github = require("../services/github");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/login", (req, res) => {
  const state = req.query.token || "";
  const url = `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}&scope=repo,workflow,read:user&state=${state}`;
  res.redirect(url);
});

router.get("/callback", async (req, res) => {
  try {
    const { code, state } = req.query;
    if (!code) {
      return res.redirect(`${process.env.CLIENT_URL}/repos?github=error&message=no_code`);
    }

    const accessToken = await github.exchangeCodeForToken(code);
    const ghUser = await github.fetchGitHubUser(accessToken);

    let user = null;

    if (state) {
      try {
        const decoded = jwt.verify(state, process.env.JWT_ACCESS_SECRET);
        user = await User.findById(decoded.id);
      } catch {
        // state token invalid, try by githubId
      }
    }

    if (!user) {
      user = await User.findOne({ githubId: ghUser.id });
    }

    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/repos?github=error&message=no_user`);
    }

    user.githubId = ghUser.id;
    user.githubUsername = ghUser.login;
    user.githubAccessToken = accessToken;
    user.avatar = ghUser.avatar || user.avatar;
    await user.save();

    res.redirect(`${process.env.CLIENT_URL}/repos?github=connected`);
  } catch (err) {
    console.error("GitHub callback error:", err);
    res.redirect(`${process.env.CLIENT_URL}/repos?github=error&message=callback_failed`);
  }
});

router.post("/disconnect", requireAuth, async (req, res) => {
  req.user.githubId = null;
  req.user.githubUsername = null;
  req.user.githubAccessToken = null;
  await req.user.save();
  res.json({ message: "GitHub disconnected" });
});

module.exports = router;
