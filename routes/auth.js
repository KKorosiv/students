const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const router = express.Router();

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password,admissionNumber, phoneNumber, location } = req.body;

  try {

    const existingUserByAdmission = await User.findOne({ admissionNumber });
    if (existingUserByAdmission) {
      return res.status(400).json({ error: 'Student already exists with this admission number' });
    }

    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ error: 'Student already exists with this email' });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      location,
      admissionNumber,
      phoneNumber,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    await newUser.save();
    res.status(201).json({ message: 'Student registered successfully', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error registering student' });
  }
});

router.post('/login', async (req, res) => {
  const { email, admissionNumber, password } = req.body;

  try {

    const user = await User.findOne({ $or: [{ admissionNumber }, { email }] });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h', 
    });

    const { password: _, ...userData } = user.toObject();

    // user data
    res.json({ token, user: userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error logging in' });
  }
});

module.exports = router;
