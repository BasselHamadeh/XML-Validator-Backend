const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

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

router.post('/', async (req, res, next) => {
  const { username, email, status, sicherheitsgruppe, password } = req.body;

  try {
    await pool.query(
      'INSERT INTO user_table(username, email, status, sicherheitsgruppe, password) VALUES($1, $2, $3, $4, $5)',
      [username, email, status, sicherheitsgruppe, password]
    );

    res.status(200).send('Benutzer erfolgreich hinzugefügt');
  } catch (error) {
    next(error);
  }
});

module.exports = router;