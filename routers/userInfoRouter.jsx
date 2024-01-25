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
  const { username, email, status, gruppe, tag, monat, jahr, uhrzeit } = req.body;

  try {
    const { rows } = await pool.query(
      'SELECT * FROM user_login_table WHERE username = $1 AND email = $2 AND status = $3 AND gruppe = $4 AND tag = $5 AND monat = $6 AND jahr = $7 AND uhrzeit = $8',
      [username, email, status, gruppe, tag, monat, jahr, uhrzeit]
    );

    res.json(rows);
  } catch (error) {
    next(error);
  }
});

module.exports = router;