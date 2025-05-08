const express = require('express');
const router = express.Router();
const db = require('../db');
const natural = require('natural');
const fs = require('fs');
const path = require('path');

// Utility: sanitize message (remove basic HTML tags)
const sanitizeMessage = (text) => text.replace(/<\/?[^>]+(>|$)/g, '');

// 📌 GET /api/queries - View all queries (Now public for development)
router.get('/', async (req, res) => {
  try {
    const [queries] = await db.execute(`SELECT * FROM queries ORDER BY id DESC`);
    res.json(queries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch queries' });
  }
});

// 📊 GET /api/queries/stats - Query chart data (Now public for development)
router.get('/stats', async (req, res) => {
  try {
    const [monthly] = await db.execute(`
      SELECT 
        YEAR(created_at) AS year,
        MONTH(created_at) AS month,
        COUNT(*) AS count
      FROM queries
      GROUP BY year, month
      ORDER BY year, month
    `);

    const [statusCounts] = await db.execute(`
      SELECT 
        status, COUNT(*) AS count
      FROM queries
      GROUP BY status
    `);

    const [autoResponses] = await db.execute(`
      SELECT 
        IF(response IS NULL, 'manual', 'auto') AS type,
        COUNT(*) AS count
      FROM queries
      GROUP BY IF(response IS NULL, 'manual', 'auto')
    `);

    res.json({ monthly, statusCounts, autoResponses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch query stats' });
  }
});

// 📩 POST /api/queries - Log query & auto-respond with fallback
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ status: 'failed', error: 'All fields required' });
  }

  try {
    const cleanMessage = sanitizeMessage(message);

    // Get previous completed queries with responses
    const [completedQueries] = await db.execute(
      `SELECT message, response FROM queries WHERE status = 'complete' AND response IS NOT NULL`
    );

    // Compare similarity
    let bestMatch = null;
    let maxScore = 0;
    const threshold = 0.6;

    for (let q of completedQueries) {
      const score = natural.JaroWinklerDistance(cleanMessage.toLowerCase(), q.message.toLowerCase());
      if (score > maxScore) {
        maxScore = score;
        bestMatch = q;
      }
    }

    // Determine response
    let status = 'pending';
    let autoReply = null;

    if (bestMatch && maxScore >= threshold) {
      autoReply = bestMatch.response;
      status = 'complete';
    } else {
      // Fallback auto-replies based on keyword detection
      const lower = cleanMessage.toLowerCase();
      if (lower.includes('price')) {
        autoReply = 'Our pricing varies depending on the product. We’ll follow up shortly.';
      } else if (lower.includes('refund')) {
        autoReply = 'Refunds are processed within 3–5 business days.';
      } else if (lower.includes('support')) {
        autoReply = 'Our support team has been notified and will assist you soon.';
      } else if (lower.includes('delay')) {
        autoReply = 'We’re sorry for the delay. We’ll update you as soon as possible.';
      } else {
        autoReply = 'Thank you for reaching out. Our team will get back to you shortly.';
      }
      status = 'complete';
    }

    // Save query to DB
    await db.execute(
      `INSERT INTO queries (name, email, message, response, status) VALUES (?, ?, ?, ?, ?)`,
      [name, email, cleanMessage, autoReply, status]
    );

    // Backup to JSON file
    const backupData = {
      name,
      email,
      message: cleanMessage,
      response: autoReply,
      status,
      date: new Date().toISOString()
    };

    const backupDir = path.join(__dirname, '../backups');
    const backupPath = path.join(backupDir, 'queries.json');
    fs.mkdirSync(backupDir, { recursive: true });

    let existing = [];
    try {
      const fileContents = fs.readFileSync(backupPath, 'utf-8');
      existing = JSON.parse(fileContents);
      if (!Array.isArray(existing)) throw new Error('Invalid format');
    } catch (parseErr) {
      console.warn('⚠️ Could not parse queries.json. Resetting file.', parseErr.message);
      existing = [];
    }

    existing.push(backupData);
    fs.writeFileSync(backupPath, JSON.stringify(existing, null, 2));

    res.status(200).json({ status, autoReply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'failed', error: err.message });
  }
});

// 📥 PATCH /api/queries/:id/reply - Sales manually responds to a query (no auth)
router.patch('/:id/reply', async (req, res) => {
  const { id } = req.params;
  const { response } = req.body;

  if (!response) {
    return res.status(400).json({ error: 'Response message is required' });
  }

  try {
    const [result] = await db.execute(
      `UPDATE queries SET response = ?, status = 'complete' WHERE id = ?`,
      [response, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Query not found' });
    }

    res.status(200).json({ message: 'Query responded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to respond to query' });
  }
});

module.exports = router;
