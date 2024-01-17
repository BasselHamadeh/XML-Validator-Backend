const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'users',
  password: 'Syria2003!',
  port: 5432,
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