const express = require('express');
const router = express.Router();
const db = require('../db');


// 🔹 PUBLIC SALE — from frontend buy form (no login required)
router.post('/public', async (req, res) => {
  const { item_type, item_id, amount, status, buyer_name, buyer_email } = req.body;

  if (!item_type || !item_id || !amount || !buyer_name || !buyer_email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO sales (item_type, item_id, amount, status, buyer_name, buyer_email)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [item_type, item_id, amount, status, buyer_name, buyer_email]
    );

    res.status(201).json({ message: 'Sale recorded', sale_id: result.insertId });
  } catch (err) {
    console.error('Error saving sale:', err);
    res.status(500).json({ error: 'Database insert failed' });
  }
});

// 🔹 TEMPORARILY PUBLIC: Get all sales (auth removed)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, 
             CASE s.item_type 
               WHEN 'product' THEN p.name 
               WHEN 'service' THEN sv.name 
             END AS item_name
      FROM sales s
      LEFT JOIN products p ON s.item_type = 'product' AND s.item_id = p.id
      LEFT JOIN services sv ON s.item_type = 'service' AND s.item_id = sv.id
      ORDER BY s.created_at DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error('Error fetching sales:', err);
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
});

// 🔹 TEMPORARILY PUBLIC: Log manual sale (auth removed)
router.post('/manual', async (req, res) => {
  const { item_type, item_id, amount, buyer_name, buyer_email } = req.body;

  if (!item_type || !item_id || !amount || !buyer_name || !buyer_email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!['product', 'service'].includes(item_type)) {
    return res.status(400).json({ error: 'Invalid item_type' });
  }

  try {
    await db.query(
      `INSERT INTO sales (item_type, item_id, amount, buyer_name, buyer_email, status)
       VALUES (?, ?, ?, ?, ?, 'complete')`,
      [item_type, item_id, amount, buyer_name, buyer_email]
    );

    res.status(201).json({ message: 'Manual sale logged' });
  } catch (err) {
    console.error('Error logging manual sale:', err);
    res.status(500).json({ error: 'Failed to log sale' });
  }
});
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'complete', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    const [result] = await db.execute(
      `UPDATE sales SET status = ? WHERE id = ?`,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    res.json({ message: 'Status updated' });
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});
// GET /api/sales/income-only
router.get('/income-only', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT amount AS totalPrice, created_at AS date
      FROM sales
      WHERE status = 'complete'
      ORDER BY created_at DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error('Error fetching income data:', err);
    res.status(500).json({ error: 'Failed to fetch income data' });
  }
});



module.exports = router;
