const db = require("../config/db");

const createShortUrl = async (originalUrl, shortCode) => {
  const sql = "INSERT INTO urls (original_url, short_code) values (?,?)";
  const [result] = await db.execute(sql, [originalUrl, shortCode]);
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
