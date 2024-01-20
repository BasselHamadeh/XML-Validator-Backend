const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'user-database',
  password: 'Syria2003!',
  port: 5432,
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