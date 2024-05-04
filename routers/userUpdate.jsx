const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM user_table');
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.put('/user/update', async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'UPDATE user_table SET email = $1, password = $2 WHERE username = $3',
      [email, hashedPassword, username]
    );

    res.status(200).send('Benutzer erfolgreich aktualisiert');
  } catch (error) {
    next(error);
  }
});

module.exports = router;