const express = require('express');
const cors = require("cors");
require('dotenv').config()

const app = express()


app.use(cors())
app.use(express.json());


const urlRoutes = require("./routes/urlRoutes")
const authRoutes = require("./routes/authRoutes")

app.use("/", urlRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
