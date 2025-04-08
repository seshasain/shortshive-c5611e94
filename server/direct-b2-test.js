import dotenv from 'dotenv';
import fs from 'fs';
import https from 'https';

// Load environment variables
dotenv.config();

// B2 Configuration
const B2_BUCKET_NAME = process.env.B2_BUCKET_NAME;
const B2_ACCESS_KEY_ID = process.env.B2_ACCESS_KEY_ID;
const B2_SECRET_ACCESS_KEY = process.env.B2_SECRET_ACCESS_KEY;
const B2_ENDPOINT = 's3.us-east-005.backblazeb2.com';

console.log('B2 Configuration:');
console.log('Bucket:', B2_BUCKET_NAME);
console.log('KeyID:', B2_ACCESS_KEY_ID ? '***' + B2_ACCESS_KEY_ID.slice(-4) : 'not set');
console.log('Secret Key:', B2_SECRET_ACCESS_KEY ? '***' + B2_SECRET_ACCESS_KEY.slice(-4) : 'not set');
console.log('Endpoint:', B2_ENDPOINT);

// Function to create a simple test file
function createTestFile() {
  const testFilePath = 'test-upload.txt';
  const testContent = 'This is a test file for B2 upload at ' + new Date().toISOString();
  fs.writeFileSync(testFilePath, testContent);
  console.log('Created test file:', testFilePath);
  return testFilePath;
}

// Function to upload a file using basic HTTP request
async function uploadFileToB2(filePath) {
  const fileContent = fs.readFileSync(filePath);
  const options = {
    hostname: B2_ENDPOINT,
    port: 443,
    path: `/${B2_BUCKET_NAME}/test-upload-${Date.now()}.txt`,
    method: 'PUT',
    headers: {
      'Content-Type': 'text/plain',
      'Content-Length': fileContent.length,
      'Authorization': 'Basic ' + Buffer.from(`${B2_ACCESS_KEY_ID}:${B2_SECRET_ACCESS_KEY}`).toString('base64')
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      console.log('Status Code:', res.statusCode);
      console.log('Headers:', res.headers);

      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({
            success: true,
            statusCode: res.statusCode,
            data: responseData
          });
        } else {
          reject(new Error(`HTTP Error: ${res.statusCode} - ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(fileContent);
    req.end();
  });
}

// Function to list bucket contents
async function listBucketContents() {
  const options = {
    hostname: B2_ENDPOINT,
    port: 443,
    path: `/${B2_BUCKET_NAME}`,
    method: 'GET',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${B2_ACCESS_KEY_ID}:${B2_SECRET_ACCESS_KEY}`).toString('base64')
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      console.log('Status Code:', res.statusCode);
      console.log('Headers:', res.headers);

      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({
            success: true,
            statusCode: res.statusCode,
            data: responseData
          });
        } else {
          reject(new Error(`HTTP Error: ${res.statusCode} - ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// Run tests
async function runTests() {
  try {
    console.log('\nTest 1: Listing bucket contents...');
    const listResult = await listBucketContents();
    console.log('✅ Successfully listed bucket contents');
    console.log(listResult.data);
  } catch (error) {
    console.error('❌ Failed to list bucket contents:', error.message);
  }

  try {
    console.log('\nTest 2: Uploading test file...');
    const testFilePath = createTestFile();
    const uploadResult = await uploadFileToB2(testFilePath);
    console.log('✅ Successfully uploaded test file');
    console.log(uploadResult.data);
    
    // Clean up
    fs.unlinkSync(testFilePath);
    console.log('Deleted local test file');
  } catch (error) {
    console.error('❌ Failed to upload test file:', error.message);
  }
}

runTests(); 