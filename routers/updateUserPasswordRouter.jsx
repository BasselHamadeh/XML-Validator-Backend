const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const crypto = require('crypto');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

function encryptPassword(password) {
  const sha256 = crypto.createHash('sha256');
  sha256.update(password);
  return sha256.digest('base64');
}

router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  try {
    const encryptedPassword = encryptPassword(newPassword);

    const userQuery = await pool.query('SELECT * FROM user_table WHERE id = $1', [id]);
    const user = userQuery.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }

    await pool.query('UPDATE user_table SET password = $1 WHERE id = $2', [encryptedPassword, id]);

    res.status(200).json({ message: 'Passwort erfolgreich aktualisiert' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;