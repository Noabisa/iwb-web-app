const express = require('express');
const router = express.Router();
const db = require('../db');

// Add a new product
router.post('/add', async (req, res) => {
  const { name, description, price } = req.body;
  try {
    await db.execute(
      'INSERT INTO products (name, description, price) VALUES (?, ?, ?)',
      [name, description, price]
    );
    res.status(200).json({ message: 'Product added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
