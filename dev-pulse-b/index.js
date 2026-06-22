const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./config/db.js");
const authRoutes = require("./routes/auth.js");
const githubAuthRoutes = require("./routes/github-auth.js");
const githubDataRoutes = require("./routes/github-data.js");
const buildRoutes = require("./routes/builds.js");
const { requireAuth } = require("./middleware/auth.js");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

app.get("/health", (req, res) => {
  res.send("Okay!");
});

app.use("/api/auth", authRoutes);
app.use("/api/auth", githubAuthRoutes);

app.use("/api", requireAuth);

app.use("/api/github", githubDataRoutes);
app.use("/api", buildRoutes);

app.listen(PORT, (req, res) => {
  console.log(`Server is listening on port ${PORT}`);
});
