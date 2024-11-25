const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const dotenv = require('dotenv');
const downloadRoute = require('./routes/downloadRoute');
const messageRoute = require('./routes/messageRoute');
const submissionRoutes = require('./routes/submissionRoute');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config();

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is missing in .env');
  process.exit(1);
} else {
  console.log('MONGODB_URI loaded from .env:', process.env.MONGODB_URI); // Confirm the URI is loaded correctly
}

const app = express();

const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

connectDB();

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions)); 
app.use(express.json()); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage });

app.use('/api/auth', authRoutes);
app.use('/api/download', downloadRoute);
app.use('/api/messages', messageRoute);
app.use('/api/submissions', submissionRoutes);

app.post('/api/recordings', upload.single('recording'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded. Please send a file with the key "recording".' });
  }
  res.status(200).json({ message: 'File uploaded successfully', file: req.file });
});

app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
