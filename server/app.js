const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS middleware - must come before routes
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Handle preflight requests
app.options(/.*/, cors());

app.use(express.json());

const urlRoutes = require("./routes/urlRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/", urlRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
