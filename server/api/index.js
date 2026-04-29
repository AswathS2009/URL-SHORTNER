require("dotenv").config();
const app = require("../app");

module.exports = (req, res) => {
  app(req, res);
};
