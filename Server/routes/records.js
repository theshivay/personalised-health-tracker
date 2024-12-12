const express = require('express');
const multer = require('multer');
const Record = require('../models/Record.js');
const { extractTextFromImage } = require('../utils/ocr.js');
const path = require('path');

const router = express.Router();

// Multer Setup for File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        // const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const extName = true;
        // const mimeType = allowedTypes.test(file.mimetype);
        const mimeType = true;
        if (extName && mimeType) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'));
        }
    },
});


// GET: Fetch All Records
router.get('/', async (req, res) => {
    try {
        const records = await Record.find();
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch records' });
    }
});

// POST: Add a New Record
router.post('/', upload.single('report'), async (req, res) => {
    try {
      let extractedData = {};
      if (req.file) {
        const filePath = req.file.path; // Get file path
        extractedData = await extractTextFromImage(filePath); // Extract data using OCR
      }
  
      const record = new Record({
        name: req.body.name,
        age: req.body.age,
        description: req.body.description,
        reportData: extractedData || {}, // Save extracted report data
      });
  
      const saved = await record.save();
      res.status(201).json(saved);
    } catch (err) {
      console.error('Error in POST /api/records:', err.message);
      res.status(500).json({ error: 'Failed to add record' });
    }
  });
  

// Delete a record by ID
router.delete('/:id', async (req, res) => {
    try {
        const record = await Record.findByIdAndDelete(req.params.id);
        if (!record) {
            return res.status(404).json({ error: 'Record not found' });
        }
        res.json({ message: 'Record deleted successfully' });
    } catch (err) {
        console.error('Error deleting record:', err.message);
        res.status(500).json({ error: 'Failed to delete record' });
    }
});


module.exports = router;
