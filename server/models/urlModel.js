const db = require("../config/db");

const createShortUrl = async (orginalUrl, shortCode) => {
  const sql = "INSERT INTO urls (orginal_url, short_code) values (?,?)";
  const [result] = await db.execute(sql, [orginalUrl, shortCode]);
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
