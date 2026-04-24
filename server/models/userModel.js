const db = require("../config/db");

const findByEmail = async (email) => {
    const sql = "select id, email, password from users where email = ? LIMIT 1";
    const [rows] = await db.execute(sql, [email]);
    return rows[0] || null;
}

const findById = async (id) => {
    const sql = "select id, email from users where id = ? LIMIT 1";
    const [rows] = await db.execute(sql, [id]);
    return rows[0] || null;
};

const createUser = async (email, hashedPassword) => {
    const sql = "insert into users (email, password) values (?, ?)";
    const [result] = await db.execute(sql, [email, hashedPassword]);
    return result.insertId;
}

module.exports = {
    findByEmail,
    findById,
    createUser,
}