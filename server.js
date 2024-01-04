const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors());

app.get('/xsd', (req, res) => {
  const xsdData = {
    data: ["Hallo ich bins Bassel! Hallo von Backend"]
  };

  res.json(xsdData);
});

const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(process.env.DB_URI, dbOptions)
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Error connecting to database:', err));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});