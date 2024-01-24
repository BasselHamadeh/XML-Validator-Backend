const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect((err) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL database');
});

const userRouter = require('./routers/userRouter.jsx');
const userInfoRouter = require('./routers/userInfoRouter.jsx');
const xsdRouter = require('./routers/xsdRouter.jsx');

app.use('/user', userRouter);
app.use('/login', userInfoRouter);
app.use('/xsd', xsdRouter);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}.`);
});