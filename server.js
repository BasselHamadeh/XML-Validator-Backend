const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'users',
  password: 'Syria2003!',
  port: 5432,
});

app.get('/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM user_table');
    res.json(rows);
  } catch (error) {
    console.error('Fehler beim Abrufen der Benutzerdaten:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/users', async (req, res) => {
  const { username, email, status, sicherheitsgruppe, password } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query('INSERT INTO public.user_table(username, email, status, sicherheitsgruppe, password) VALUES($1, $2, $3, $4, $5)',
      [username, email, status, sicherheitsgruppe, password]);

    await client.query('COMMIT');
    res.status(200).send('Benutzer erfolgreich hinzugefügt');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Fehler beim Hinzufügen des Benutzers:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}.`);
});