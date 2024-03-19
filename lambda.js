const AWS = require('aws-sdk');
const fs = require('fs');

// Configure AWS SDK with your credentials and preferred region
AWS.config.update({ region: 'YOUR_REGION', accessKeyId: 'YOUR_ACCESS_KEY_ID', secretAccessKey: 'YOUR_SECRET_ACCESS_KEY' });

// Create an instance of the Lambda service
const lambda = new AWS.Lambda();
console.log('Creating Lambda instance', lambda);

// Parameters for creating the Lambda function
const functionName = 'YOUR_FUNCTION_NAME';
const runtime = 'nodejs14.x';
const role = 'YOUR_ROLE_ARN';
const handler = 'index.handler';
const zipFile = 'lambda_function.zip';

// Read the content of the zip file
const zipFileContent = fs.readFileSync(zipFile);

// Parameters for creating the Lambda function
const params = {
    Code: { ZipFile: zipFileContent },
    FunctionName: functionName,
    Handler: handler,
    Role: role,
    Runtime: runtime,
    Description: 'Your Lambda function description',
    Timeout: 30, // Maximum execution time for the Lambda function in seconds
    MemorySize: 256 // Maximum memory that can be allocated to the Lambda function in MB
};

// Create the Lambda function
lambda.createFunction(params, (err, data) => {
    if (err) {
        console.error('Error creating Lambda function:', err);
    } else {
        console.log('Lambda function created successfully:', data.FunctionArn);
    }
});
