const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv'); // To load environment variables
const helmet = require('helmet'); // For security headers

dotenv.config();  // Load environment variables from a .env file

const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 5000;  // Use environment variable or default to 5000

// Middleware
app.use(cors());
app.use(helmet());  // Add security headers
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

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong, please try again later.' });
});

// Start server
const server = app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Closed all connections.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Closed all connections.');
    process.exit(0);
  });
});
