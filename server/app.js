const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();


// CORS middleware - must come before routes
const corsOptions = {
  origin: "*",
  credentials: false,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());

// Render keep-alive health check
app.get("/health", (req,res)=>{
    res.status(200).json({
        status:"alive",
        time:new Date()
    });
});

const urlRoutes = require("./routes/urlRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/", urlRoutes);
app.use("/api/auth", authRoutes);


module.exports = app;
