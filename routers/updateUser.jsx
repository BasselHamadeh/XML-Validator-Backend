const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const crypto = require('crypto');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE_XML_Validator,
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
  const { username, email, newPassword } = req.body;

  try {
    const encryptedPassword = encryptPassword(newPassword);

    const userQuery = await pool.query('SELECT * FROM user_table WHERE id = $1', [id]);
    const user = userQuery.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }

    const existingUsernameQuery = await pool.query('SELECT * FROM user_table WHERE username = $1 AND id != $2', [username, id]);
    const existingUsername = existingUsernameQuery.rows[0];
    if (existingUsername) {
      return res.status(400).json({ message: 'Benutzername bereits vergeben' });
    }

    const existingEmailQuery = await pool.query('SELECT * FROM user_table WHERE email = $1 AND id != $2', [email, id]);
    const existingEmail = existingEmailQuery.rows[0];
    if (existingEmail) {
      return res.status(400).json({ message: 'E-Mail-Adresse bereits vergeben' });
    }

    await pool.query('UPDATE user_table SET username = $1, email = $2, password = $3 WHERE id = $4', [username, email, encryptedPassword, id]);

    res.status(200).json({ message: 'Profil erfolgreich aktualisiert' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;