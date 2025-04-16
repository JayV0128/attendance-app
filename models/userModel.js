const db = require('./db');

async function getUserByToken(token) {
    const [rows] = await db.query(
        'SELECT id FROM app_users WHERE nfc_tag_id = ? OR qr_code_id = ?',
        [token, token]
    );
    return rows[0];
}

async function createUser(name, nfc_tag_id, qr_code_id) {
    const [result] = await db.query(
        'INSERT INTO app_users (name, nfc_tag_id, qr_code_id) VALUES (?, ?, ?)',
        [name, nfc_tag_id, qr_code_id]
    );
    return result;
}

module.exports = { getUserByToken, createUser };
