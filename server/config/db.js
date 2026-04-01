const mysql2 = require("mysql2");
require("dotenv").config();

const connection = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 20,
})

connection.getConnection((err, conn) => {
    if (err) {
        console.log("Error connecting to database", err);
    } else {
        console.log("Connected to mysql database")
        conn.release()
    }
})

module.exports = connection;