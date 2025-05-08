const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());  // For parsing application/json

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', require('./routes/products'));
app.use('/api/services', require('./routes/services'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/income', require('./routes/income'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/files', require('./routes/files')); // ✅ Corrected this line
app.use('/api/queries', require('./routes/queries'));
app.use('/api/system-status', require('./routes/systemStatus'));
app.use('/api/backup', require('./routes/backup'));

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
