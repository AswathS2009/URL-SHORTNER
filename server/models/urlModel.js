const db = require("../config/db");

const createShortUrl = async (originalUrl, shortCode, userId) => {
  const sql = "INSERT INTO urls (original_url, short_code, user_id) values (?,?,?)";
  const [result] = await db.execute(sql, [originalUrl, shortCode, userId]);
  return result;
};

const getUrlByCode = async (code) => {
  const sql = "select * from urls where TRIM(short_code) = TRIM(?)";
  const [rows] = await db.execute(sql, [code]);
  return rows;
};

module.exports = {
  createShortUrl,
  getUrlByCode,
};
