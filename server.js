const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'users',
  password: 'Syria2003!',
  port: 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to database');
  release();
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.get('/user', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM user_table');
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.get('/xsd', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT xsd_file_name FROM xsd_files');
    const xsdFileNames = rows.map(row => row.xsd_file_name);
    res.json({ data: xsdFileNames });
  } catch (error) {
    next(error);
  }
});

app.post('/user', async (req, res, next) => {
  const { username, email, status, sicherheitsgruppe, password } = req.body;

  try {
    await pool.query(
      'INSERT INTO public.user_table(username, email, status, sicherheitsgruppe, password) VALUES($1, $2, $3, $4, $5)',
      [username, email, status, sicherheitsgruppe, password]
    );

    res.status(200).send('Benutzer erfolgreich hinzugefügt');
  } catch (error) {
    next(error);
  }
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}.`);
});