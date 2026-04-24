const express = require("express");
const router = express.Router()
const urlController = require("../controllers/urlController");
const {protect} = require("../middleware/authMiddleware");

router.post("/shorten", protect, urlController.createShortUrl);
router.get("/:code", urlController.redirectUrl);

module.exports = router;