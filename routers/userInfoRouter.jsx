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
    const { rows } = await pool.query('SELECT * FROM user_login_informations');
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const { username, email, status, sicherheitsgruppe, tag, monat, jahr, uhrzeit } = req.body;

  try {
    await pool.query(
      'INSERT INTO user_login_informations (benutzername, email, status, gruppe, tag, monat, jahr, uhrzeit) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
      [username, email, status, sicherheitsgruppe, tag, monat, jahr, uhrzeit]
    );

    res.status(200).send('Benutzer-Login-Informationen erfolgreich hinzugefügt');
  } catch (error) {
    next(error);
  }
});

module.exports = router;