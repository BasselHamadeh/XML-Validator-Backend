const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM user_login_table');
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const { username, email, sicherheitsgruppe, tag, monat, jahr, uhrzeit } = req.body;

  try {
    const { rows } = await pool.query(
      'SELECT * FROM user_login_table WHERE username = $1 AND email = $2 AND sicherheitsgruppe = $3 AND tag = $4 AND monat = $5 AND jahr = $6 AND uhrzeit = $7',
      [username, email, sicherheitsgruppe, tag, monat, jahr, uhrzeit]
    );

    res.json(rows);
  } catch (error) {
    next(error);
  }
});

module.exports = router;