const db = require('./db');

async function createLog(userId, method, deviceInfo) {
  const [result] = await db.query(
    'INSERT INTO attendance_logs (user_id, method, device_info) VALUES (?, ?, ?)',
    [userId, method, deviceInfo]
  );
  return result;
}

async function getLogs() {
  const [rows] = await db.query(`
    SELECT a.id, u.name, a.method, a.timestamp, a.device_info
    FROM attendance_logs a
    JOIN app_users u ON a.user_id = u.id
    ORDER BY a.timestamp DESC
  `);
  return rows;
}

module.exports = { createLog, getLogs };
