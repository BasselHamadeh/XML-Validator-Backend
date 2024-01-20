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
  database: 'user-database',
  password: 'Syria2003!',
  port: 5432,
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

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}.`);
});