const generateCode = require("../utils/generateCode");
const urlModel = require("../models/urlModel");

const createShortUrl = async (req, res) => {
  try {
    const { original_url } = req.body;
    console.log(original_url);
    if (!original_url) {
      return res.status(400).json({ message: "URL is required" });
    }

    const shortCode = generateCode();

    await urlModel.createShortUrl(original_url, shortCode);

    res.json({
      short_url: `http://localhost:5000/${shortCode}`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const redirectUrl = async (req, res) => {
  try {
    const { code } = req.params;
    const shortCode = decodeURIComponent(code).trim();

    const result = await urlModel.getUrlByCode(shortCode);

    if (result.length === 0) {
      return res.status(404).json({ message: "URL not found" });
    }

    const originalUrl = result[0].original_url || result[0].orginal_url;

    if (!originalUrl) {
      return res
        .status(500)
        .json({ message: "URL record is missing the destination address" });
    }

    res.redirect(originalUrl);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createShortUrl,
  redirectUrl,
};
