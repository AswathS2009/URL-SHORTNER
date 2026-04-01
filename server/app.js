const express = require('express');
const cors = require("cors");
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json());
// we will include  routes here

module.exports = app;
