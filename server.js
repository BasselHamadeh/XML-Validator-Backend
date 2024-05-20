const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const { parseXml } = require('libxmljs');

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
  console.log('Connected to PostgreSQL database!\n');
});

const userRouter = require('./routers/userRouter.jsx');
const userInfoRouter = require('./routers/userInfoRouter.jsx');
const xsdRouter = require('./routers/xsdRouter.jsx');
const { handleValidationWithoutXSD } = require('./routers/handleValidationWithoutXSD.jsx');
const { validateWithXSD } = require('./routers/handleValidationWithXSD.jsx');

app.use('/user', userRouter);
app.use('/login', userInfoRouter);
app.use('/xsd', xsdRouter);
app.post('/validateWithoutXSD', handleValidationWithoutXSD);
app.post('/validateWithXSD', async (req, res) => {
  try {
    const { xmlData, xsdData } = req.body;
    const result = await validateWithXSD(xmlData, xsdData);
    res.json({ success: true, result });
  } catch (error) {
    res.status(400).json({ success: false, errors: [error.message] });
  }
});

const updateUser = require('./routers/updateUser.jsx');
app.use('/updateProfile', updateUser);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`The server is running at http://localhost:${PORT}.`);
});