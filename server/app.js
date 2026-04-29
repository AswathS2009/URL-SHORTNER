const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "http://localhost:3000",
  "https://frontend-url-shortner-production.up.railway.app",
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all in production for now
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

const urlRoutes = require("./routes/urlRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/", urlRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
