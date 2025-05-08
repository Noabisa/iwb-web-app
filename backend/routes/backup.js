const express = require('express');
const router = express.Router();
const db = require('../db');
const fs = require('fs');
const path = require('path');

// ─── Route: Backup Sales to Local JSON File ───────────────────────────────
router.post('/sales', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM sales');
    const json = JSON.stringify(rows, null, 2);

    const localPath = path.join(__dirname, '../backups/sales.json');
    fs.mkdirSync(path.dirname(localPath), { recursive: true });
    fs.writeFileSync(localPath, json);

    res.json({ ok: true, message: 'Sales backed up locally' });
  } catch (err) {
    console.error('Sales backup error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ─── Route: Backup Queries to Local JSON File ─────────────────────────────
router.post('/queries', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM queries');
    const json = JSON.stringify(rows, null, 2);

    const localPath = path.join(__dirname, '../backups/queries.json');
    fs.mkdirSync(path.dirname(localPath), { recursive: true });
    fs.writeFileSync(localPath, json);

    res.json({ ok: true, message: 'Queries backed up locally' });
  } catch (err) {
    console.error('Queries backup error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
