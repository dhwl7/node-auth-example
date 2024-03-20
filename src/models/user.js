const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'admin'],
    required: true,
  },
  profile_picture: {
    type: String
  },
  mobile_number: {
    type: Number
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String
  },
  address: {
    type: String
  },
  password: {
    type: String,
    required: true,
  },
  created_on: {
    type: Date,
    default: new Date()
  },
});

// Hash the password before saving to the database
userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
