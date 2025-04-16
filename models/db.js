const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'attendance-db.c2jeam6og3hx.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'PAss#X1234',
    database: 'attendance-sys',
    waitForConnections: true,
});

module.exports = pool.promise();