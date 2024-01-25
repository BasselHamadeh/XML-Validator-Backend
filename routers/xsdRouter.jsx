const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE_XSD,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT xsd_file_name, xsd_content FROM xsd_files_table');
    const xsdFiles = rows.map(row => ({ fileName: row.xsd_file_name, content: row.xsd_content }));
    res.json({ data: xsdFiles });
  } catch (error) {
    next(error);
  }
});

module.exports = router;