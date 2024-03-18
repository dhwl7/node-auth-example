const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/node_auth_example';

// MongoDB connection options
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

// Connect to MongoDB
mongoose.connect(mongoURI, options)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
});

// Get the default connection
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('MongoDB connection successful');
});

// Export the connection for use in other parts of the application
module.exports = db;

//Online Configure a Network Connection
// const connection = mongoose.createConnection(MONGO_URI= "mongodb+srv://dhavalraiyani277:YFtRBr0Bgt52flof@cluster0.2jkyxdf.mongodb.net/", {
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true
// });
