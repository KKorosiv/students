const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post('/', upload.single('assignmentFile'), (req, res) => {
  const { title, description } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  res.status(200).json({
    message: 'Assignment submitted successfully!',
    assignment: { title, description, filePath: file.path },
  });
});

module.exports = router;
