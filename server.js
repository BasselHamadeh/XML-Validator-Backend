const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { parseString } = require('xml2js');
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
  console.log('Connected to PostgreSQL!');
});

const userRouter = require('./routers/userRouter.jsx');
const userInfoRouter = require('./routers/userInfoRouter.jsx');
const xsdRouter = require('./routers/xsdRouter.jsx');
const { handleValidationWithoutXSD } = require('./routers/ValidateXML.jsx');

app.use('/user', userRouter);
app.use('/login', userInfoRouter);
app.use('/xsd', xsdRouter);

app.post('/validateWithoutXSD', handleValidationWithoutXSD);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}.`);
});