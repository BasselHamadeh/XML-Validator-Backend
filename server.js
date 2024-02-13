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

app.use('/user', userRouter);
app.use('/login', userInfoRouter);
app.use('/xsd', xsdRouter);

app.post('/validateWithoutXSD', async (req, res) => {
  try {
    const xmlData = req.body.xmlData;

    validateWithoutXSD(xmlData)
      .then((result) => {
        res.json({ success: true, validationResults: result });
      })
      .catch((error) => {
        console.error('Error during validation without XSD:', error);
        res.status(400).json({ success: false, errors: ['Validation failed', ...error] });
      });
  } catch (error) {
    console.error('Error during validation without XSD:', error);
    res.status(500).json({ success: false, errors: ['Internal Server Error'] });
  }
});

const validateWithoutXSD = async (xmlData) => {
  return new Promise((resolve, reject) => {
    if (!xmlData.trim()) {
      reject(['No XML content provided']);
      return;
    }

    parseString(xmlData, { explicitArray: false }, (err, result) => {
      if (err) {
        console.error('Error parsing XML:', err);
        reject(['Error parsing XML', err.message]);
      } else {
        if (result && result.parsererror) {
          const parserErrors = result.parsererror;
          const errorMessage = parserErrors.trim();
          reject([errorMessage]);
        } else {
          resolve(result);
        }
      }
    });
  });
};

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}.`);
});