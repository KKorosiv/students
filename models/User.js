const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  admissionNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
