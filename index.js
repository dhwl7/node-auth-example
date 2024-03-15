// app.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const filePath = path.join(__dirname, 'src', 'public', 'index.html');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/node_auth_example', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Online Configure a Network Connection
// const connection = mongoose.createConnection(MONGO_URI= "mongodb+srv://dhavalraiyani277:YFtRBr0Bgt52flof@cluster0.2jkyxdf.mongodb.net/", {
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true
// });

app.get('/', (req, res) => {
  // Use path.resolve for absolute path
  console.log('path.resolve', path.resolve(__dirname));
  res.sendFile(path.resolve(__dirname, '../src/views/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../src/views/login.html'));
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const UserRoutes = require('./src/routes/route');
app.use('/', UserRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} HI NODE`);
});
