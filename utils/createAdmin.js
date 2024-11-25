import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js'; 
import dotenv from 'dotenv';

dotenv.config(); 

const dbURI = process.env.MONGO_URI;

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log('Database connected successfully'))
      .catch((error) => {
        console.error('Database connection error:', error);
        process.exit(1); 
      });

    const hashedPassword = await bcrypt.hash('Welcome69', 10); 
    
    const admin = new Admin({
      admissionNumber: '67890',
      email: 'samhenia9@gmail.com',
      password: hashedPassword, 
      phoneNumber: '254746454686',
    });

    await admin.save();
    console.log('Admin user created successfully!');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();
