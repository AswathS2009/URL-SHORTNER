const db = require("../config/db");

const createShortUrl = async (originalUrl, shortCode, userId) => {
  const sql =
    "INSERT INTO urls (original_url, short_code, user_id) values (?,?,?)";
  const [result] = await db.execute(sql, [originalUrl, shortCode, userId]);
  return result;
};

const getUrlByCode = async (code) => {
  const sql = "select * from urls where TRIM(short_code) = TRIM(?)";
  const [rows] = await db.execute(sql, [code]);
  return rows;
};

const codeExists = async (code) => {
  const sql = "select id from urls where TRIM(short_code) = TRIM(?) limit 1";
  const [rows] = await db.execute(sql, [code]);
  return rows.length > 0;
};

const getUrlsByUserId = async (userId) => {
  const sql =
    "select id, original_url, short_code, created_at from urls where user_id = ? order by id desc";
  const [rows] = await db.execute(sql, [userId]);
  return rows;
};

const deleteUrlByIdAndUserId = async (id, userId) => {
  const sql = "delete from urls where id = ? and user_id = ?";
  const [result] = await db.execute(sql, [id, userId]);
  return result;
};

module.exports = {
  createShortUrl,
  getUrlByCode,
  codeExists,
  getUrlsByUserId,
  deleteUrlByIdAndUserId,
};
