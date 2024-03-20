const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const bodyParser = require('body-parser');
const filePath = path.join(__dirname, 'src', 'public', 'index.html');
const awsServerlessExpress = require('aws-serverless-express');
const db = require('./src/services/mongodb.js');
const UserRoutes = require('./src/routes/route');
const serverless = require('serverless-http');
// const lambda = require('../node-auth-example/lambda.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', UserRoutes);

// module.exports.handler = async (event) => {
//   console.log('event', event);
//   // Proxy the request to Express
//   return await app(event);
// };


module.exports.handler = serverless(app);


app.get('/', (req, res) => {
  console.log('path.resolve', path.resolve(__dirname));
  res.sendFile(path.resolve(__dirname, './src/views/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.resolve(__dirname, './src/views/login.html'));
});



// const server = awsServerlessExpress.createServer(app);

// exports.handler = (event, context) => {
//   awsServerlessExpress.proxy(server, event, context);
// };

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} HI NODE`);
});



// const AWS = require('aws-sdk');
// const fs = require('fs');
// const path = require('path');

// // Load credentials from local AWS configuration or environment variables
// AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: 'your_profile_name' });

// // Create a new Lambda service object
// const lambda = new AWS.Lambda({ region: 'us-east-1' }); // Replace 'us-east-1' with your desired AWS region

// // Read your Express application code
// const lambdaCode = fs.readFileSync(path.resolve(__dirname, 'lambda.js'));

// // Prepare parameters for creating the Lambda function
// const params = {
//   Code: {
//     ZipFile: lambdaCode,
//   },
//   FunctionName: 'YourLambdaFunctionName', // Provide a name for your Lambda function
//   Handler: 'lambda.handler', // Entry point function for your Lambda
//   Role: 'arn:aws:iam::your_account_id:role/YourLambdaExecutionRole', // Replace with the ARN of your Lambda execution role
//   Runtime: 'nodejs14.x', // Specify the Node.js runtime version
//   Timeout: 30, // Maximum execution time for your Lambda function in seconds
// };

// // Create or update the Lambda function
// lambda.createFunction(params, (err, data) => {
//   if (err) console.log(err, err.stack);
//   else console.log(data);
// });
