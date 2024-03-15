// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const Joi = require('joi');


function generateToken(email, role) {
  return jwt.sign({ email, role }, 'secret', { expiresIn: '1m' });
}

exports.hello = async (req, res) => {
  console.log('hi');
  res.json({ message: 'Hi Node' });
};

exports.register = async (req, res) => {
  try {
    const schema = Joi.object().keys({
      role: Joi.string().required(),
      name: Joi.string().required(),
      email: Joi.string().required(),
      address: Joi.string().required(),
      mobile_number: Joi.number().required(),
      password: Joi.string().optional().allow(''),
      profile_picture: Joi.string().optional().allow(''),
    });
    
    var profile_picture = '';
    const validate_query = Joi.validate(req.body, schema, { abortEarly: true });
    // console.log('validate_query', validate_query.value.name);

    if (validate_query.error) {
      if (validate_query.error.details && validate_query.error.details[0].message) {
        res.status(400).json({ message: validate_query.error.details[0].message });
      } else {
        res.status(400).json({ message: validate_query.error.message });
      }
      return;
    }
  
    if (req.files.length > 0) {
      path_image = `/adminImage/${req.files[0].filename}`;
      validate_query.value.profile_picture = path_image
      console.log('validate_query.value.profile_picture', validate_query.value.profile_picture);
    }

    const newUser = await User.create(validate_query.value);
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.log('erroe =>', error);
    res.status(400).json({ error: 'User registration failed' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log('user', user);
    console.log('password', password);

    if (user && bcrypt.compareSync(password, user.password)) {
      console.log('Password is correct');
      const token = generateToken(email, user.role);
      
      console.log('token', token);

      res.json({ token });
    } else {
      console.log('Password is incorrect or user not found');
      console.log('Input Password:', password);
      console.log('User Password:', user ? user.password : 'User not found');
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUserList = async (req, res) => {
  try {
    const authToken = req.headers['authorization'];
    console.log('authToken', authToken);

    if (!authToken) {
      return res.status(401).json({ error: 'Authorization token is missing' });
    }

    const decoded = jwt.verify(authToken, 'secret');
    // console.log('decoded', decoded);

    if (decoded.role === 'admin') {
      const userList = await User.find({}, { password: 0 });
      res.json(userList);
    } else {
      res.status(403).json({ error: 'Forbidden - Admin access only' });
    }

  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
