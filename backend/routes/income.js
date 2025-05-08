const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

// GET monthly income data (only for verified finance personnel)
router.get('/monthly', verifyToken, authorizeRole('finance'), async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT 
        DATE_FORMAT(date, '%Y-%m') AS month,
        SUM(CASE WHEN item_type = 'product' THEN amount ELSE 0 END) AS product_income,
        SUM(CASE WHEN item_type = 'service' THEN amount ELSE 0 END) AS service_income
      FROM sales
      WHERE status = 'completed'
      GROUP BY month
      ORDER BY month ASC
    `);

    const result = await Promise.all(rows.map(async row => {
      const total = row.product_income + row.service_income;

      // Get overridden expenses if any
      const [overrideRows] = await db.promise().query(
        'SELECT overridden_expenses FROM income_overrides WHERE month = ?',
        [row.month]
      );

      const expenses = overrideRows.length ? overrideRows[0].overridden_expenses : total * 0.3;
      const net_income = total - expenses;

      return {
        month: row.month,
        total_income: total,
        product_income: row.product_income,
        service_income: row.service_income,
        expenses,
        net_income
      };
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Update monthly expenses override
router.put('/monthly/:month', verifyToken, authorizeRole('finance'), async (req, res) => {
  const { month } = req.params;
  const { newExpenses } = req.body;

  if (!newExpenses || isNaN(newExpenses)) {
    return res.status(400).json({ error: 'Valid newExpenses value is required' });
  }

  try {
    // Ensure the month exists in sales
    const [checkRows] = await db.promise().query(`
      SELECT 1 FROM sales
      WHERE status = 'completed' AND DATE_FORMAT(date, '%Y-%m') = ?
      LIMIT 1
    `, [month]);

    if (!checkRows.length) {
      return res.status(404).json({ error: 'No completed sales found for the given month' });
    }

    // Insert or update the override
    await db.promise().query(`
      INSERT INTO income_overrides (month, overridden_expenses)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE overridden_expenses = ?
    `, [month, newExpenses, newExpenses]);

    res.json({ message: `Expenses for ${month} updated to ${newExpenses}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
