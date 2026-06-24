const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const connectDB = require("./config/db.js");
const authRoutes = require("./routes/auth.js");
const githubAuthRoutes = require("./routes/github-auth.js");
const githubDataRoutes = require("./routes/github-data.js");
const buildRoutes = require("./routes/builds.js");
const incidentRoutes = require("./routes/incidents.js");
const aiRoutes = require("./routes/ai.js");
const Incident = require("./models/Incident.js");
const { requireAuth } = require("./middleware/auth.js");
const { startWorker } = require("./services/worker.js");

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
app.use("/api", incidentRoutes);
app.use("/api", aiRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true },
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Authentication required"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    socket.userId = decoded.id;
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  socket.join(socket.userId);
});

startWorker(io);

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = { io };
