const express = require("express");
const router = express.Router();
const urlController = require("../controllers/urlController");
const { protect } = require("../middleware/authMiddleware");

router.post("/shorten", urlController.createShortUrl);
router.get("/my-links", protect, urlController.getMyLinks);
router.get("/:code", urlController.redirectUrl);
router.delete("/my-links/:id", protect, urlController.deleteMyLink);
module.exports = router;
