const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { requireAuth } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../validators/auth");

const router = express.Router();

function generateAccessToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m",
  });
}

function generateRefreshToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES || "7d",
  });
}

function setRefreshCookie(res, token) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/api/auth",
  });
}

router.post("/register", validate(registerSchema), async (req, res) => {
  try {
    const { name, email, password } = req.validated;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, password });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    setRefreshCookie(res, refreshToken);

    res.status(201).json({ user, accessToken });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.validated;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    setRefreshCookie(res, refreshToken);

    res.json({ user, accessToken });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const accessToken = generateAccessToken(user._id);
    res.json({ accessToken });
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", { path: "/api/auth" });
  res.json({ message: "Logged out successfully" });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
