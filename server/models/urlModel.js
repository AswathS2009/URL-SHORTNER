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
    "select id, original_url, short_code, clicks, created_at from urls where user_id = ? order by id desc";
  const [rows] = await db.execute(sql, [userId]);
  return rows;
};

const getTotalClicksByUserId = async (userId) => {
  const sql =
    "select COALESCE(SUM(clicks), 0) as total_clicks from urls where user_id = ?";
  const [rows] = await db.execute(sql, [userId]);
  return Number(rows[0]?.total_clicks || 0);
};

const getTotalClicksOverall = async () => {
  const sql = "select COALESCE(SUM(clicks), 0) as total_clicks from urls";
  const [rows] = await db.execute(sql);
  return Number(rows[0]?.total_clicks || 0);
};

const getTotalUrlsOverall = async () => {
  const sql = "select COUNT(*) as total_urls from urls";
  const [rows] = await db.execute(sql);
  return Number(rows[0]?.total_urls || 0);
};

const deleteUrlByIdAndUserId = async (id, userId) => {
  const sql = "delete from urls where id = ? and user_id = ?";
  const [result] = await db.execute(sql, [id, userId]);
  return result;
};

const incrementClicks = async (id) => {
  const sql = "UPDATE urls SET clicks = clicks + 1 WHERE id = ?";
  const [result] = await db.execute(sql, [id]);
  return result;
};

module.exports = {
  createShortUrl,
  getUrlByCode,
  codeExists,
  getUrlsByUserId,
  getTotalClicksByUserId,
  getTotalClicksOverall,
  getTotalUrlsOverall,
  deleteUrlByIdAndUserId,
  incrementClicks,
};
