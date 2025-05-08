const express = require('express');
const router = express.Router();
const db = require('../db'); // mysql2/promise

// Add a new expense
router.post('/add', async (req, res) => {
  const { title, amount, category, date, created_by } = req.body;

  if (!title || !amount || !date || !created_by) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const formattedDate = new Date(date).toISOString().split('T')[0];

    const [result] = await db.query(
      'INSERT INTO expenses (title, amount, category, date, created_by) VALUES (?, ?, ?, ?, ?)',
      [title, amount, category || null, formattedDate, created_by]
    );

    res.status(201).json({ message: 'Expense added', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM expenses ORDER BY date DESC');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

module.exports = router;
