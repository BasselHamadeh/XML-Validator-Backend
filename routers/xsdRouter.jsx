const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'xsd-database',
  password: 'Syria2003!',
  port: 5432,
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