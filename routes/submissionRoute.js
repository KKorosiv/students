const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path');

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

  const assignmentData = {
    title,
    description,
    filePath: file.path, 
  };



  res.status(200).json({
    message: 'Assignment submitted successfully!',
    assignment: { title, description, filePath: file.path },
  });
});

module.exports = router;
