const express = require('express');
const cors = require("cors");
require('dotenv').config()
const urlRoutes = require("./routes/urlRoutes")

const app = express()
app.use(cors())
app.use(express.json());

app.use("/", urlRoutes);

module.exports = app;
