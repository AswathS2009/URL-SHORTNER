const express = require('express');
const cors = require("cors");
require('dotenv').config()
const app = express()


app.use(cors())
app.use(express.json());


const urlRoutes = require("./routes/urlRoutes")

app.use("/", urlRoutes);

module.exports = app;
