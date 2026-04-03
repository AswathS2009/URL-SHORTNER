const express = require("express");
const router = express.Router()
const urlController = require("../controllers/urlController");

router.post("/shorten", urlController.createShortUrl);
router.get("/:code", urlController.redirectUrl);
router.post("/:code", urlController.redirectUrl);

module.exports = router;