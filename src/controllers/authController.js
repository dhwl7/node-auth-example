// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const serverlessSdk = require('@serverless/sdk');



function generateToken(email, role) {
  return jwt.sign({ email, role }, 'secret', { expiresIn: '20m' });
}

exports.hello = async (req, res) => {
  try {
    console.log('hi');
    res.json({ message: 'Hi Node' });
  } catch (error) {
    console.log('erroe =>', error);
    res.status(400).json({ error: error });
  }

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
    console.log('validate_query', validate_query);

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
    console.log('newUSer', newUser);

    res.json({ message: 'User registered successfully' });
  } catch (ex) {
    console.log('erroe =>', ex);
    res.status(400).json({ error: 'User registration failed', message: serverlessSdk.captureError(ex) });
  }
};

exports.loginBy = async (req, res) => {
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
    console.log('decoded', decoded);

    if (decoded.role === 'admin') {
      const userList = await User.find({}, { password: 0 });
      res.status(200).json({ message: 'Get User List', userList : userList });
    } else {
      res.status(403).json({ error: 'Forbidden - Admin access only', message : 'No' });
    }

  } catch (ex) {
    console.log('erroe =>', ex);
    res.status(400).json({ error: serverlessSdk.captureError(ex), message : "No"});
  }
};
