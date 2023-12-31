const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/xsd', (req, res) => {
  const xsdData = {
    data: ["Hallo ich bins Bassel! Hallo von Backend"],
  };

  res.json(xsdData);
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});