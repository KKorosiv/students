const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/:id', (req, res) => {
  const { id } = req.params;

  const filePath = path.join(__dirname, 'assignments', `${id}.pdf`); // Adjust file path and extension as needed

  res.download(filePath, (err) => {
    if (err) {
      res.status(500).send('File not found or server error');
    }
  });
});

module.exports = router;
