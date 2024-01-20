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
    const { rows } = await pool.query('SELECT xsd_file_name FROM xsd_files_table');
    const xsdFileNames = rows.map(row => row.xsd_file_name);
    res.json({ data: xsdFileNames });
  } catch (error) {
    next(error);
  }
});

module.exports = router;