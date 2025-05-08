const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    server: 'Online',
    database: 'Connected', // Update if you're actually connecting to one
    storage: 'Available', // You could add disk usage check later
    usersOnline: Math.floor(Math.random() * 10) + 1,
  });
});

module.exports = router;
