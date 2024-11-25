// /backend/scripts/createAdmin.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const dbURI = 'mongodb+srv://Muuru:Muuru2025@cluster0.pn6ad.mongodb.net/myDatabase?retryWrites=true&w=majority';

const createAdmin = async () => {
  const admissionNumber = '2025';
  const email = 'samuelhenia2@gmail.com';
  const password = 'Muuru2025';
  const phoneNumber = '0746454686';

  const hashedPassword = await bcrypt.hash(password, 10);

  const newAdmin = new User({
    admissionNumber,
    email,
    password: hashedPassword,
    phoneNumber,
    isAdmin: true, 
  });

  try {
  
    await newAdmin.save();
    console.log('Admin user created successfully!');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.disconnect(); 
  }
};

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    createAdmin();
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));
