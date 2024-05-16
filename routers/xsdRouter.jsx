const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE_XML_Validator,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT xsd_file_name FROM xsd_files_table');
    const xsdFiles = rows.map(row => ({ fileName: row.xsd_file_name, content: row.xsd_content }));
    res.json({ data: xsdFiles });
  } catch (error) {
    next(error);
  }
});

router.get('/:filename', async (req, res, next) => {
  try {
    const fileName = req.params.filename;
    console.log('Requested file name:', fileName);

    const { rows } = await pool.query('SELECT xsd_content FROM xsd_files_table WHERE xsd_file_name = $1', [fileName]);

    if (rows.length === 0) {
      res.status(404).json({ error: 'XSD file not found' });
      return;
    }

    const xsdContent = rows[0].xsd_content;
    res.json({ data: xsdContent });
  } catch (error) {
    next(error);
  }
});

module.exports = router;