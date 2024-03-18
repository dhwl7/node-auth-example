const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const bodyParser = require('body-parser');
const filePath = path.join(__dirname, 'src', 'public', 'index.html');
const db = require('./src/services/mongodb.js');
const UserRoutes = require('./src/routes/route');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', UserRoutes);

app.get('/', (req, res) => {
  console.log('path.resolve', path.resolve(__dirname));
  res.sendFile(path.resolve(__dirname, './src/views/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.resolve(__dirname, './src/views/login.html'));
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} HI NODE`);
});
