const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../db'); // MySQL connection
const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename with timestamp
  },
});

const upload = multer({ storage });

// Route to upload a file and store metadata in MySQL
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileMetadata = {
    name: req.file.originalname, // The original file name
    size: `${(req.file.size / 1024).toFixed(2)} KB`, // Convert file size to KB
    path: `/uploads/${req.file.filename}`, // Path where file is saved
  };

  try {
    // Insert file metadata into MySQL database
    await db.execute(
      'INSERT INTO files (name, size, path) VALUES (?, ?, ?)',
      [fileMetadata.name, fileMetadata.size, fileMetadata.path]
    );

    res.status(200).json({
      message: 'File uploaded successfully',
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Route to view uploaded files from MySQL
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM files');
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

// Route to update file metadata (e.g., name, size, or path)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, size, path } = req.body;

  try {
    await db.execute(
      'UPDATE files SET name = ?, size = ?, path = ? WHERE id = ?',
      [name, size, path, id]
    );
    res.status(200).json({ message: 'File metadata updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update file' });
  }
});

module.exports = router;
