import dotenv from 'dotenv';
import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

// Configure Backblaze B2
const b2 = new AWS.S3({
  endpoint: 'https://s3.us-east-005.backblazeb2.com',
  accessKeyId: process.env.B2_ACCESS_KEY_ID,
  secretAccessKey: process.env.B2_SECRET_ACCESS_KEY,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
  region: 'us-east-005'
});

const B2_BUCKET_NAME = process.env.B2_BUCKET_NAME;

async function testB2Connection() {
  console.log('Starting B2 connection test...');
  console.log('Configuration:', {
    bucket: B2_BUCKET_NAME,
    endpoint: 'https://s3.us-east-005.backblazeb2.com',
    region: 'us-east-005',
    keyId: process.env.B2_ACCESS_KEY_ID ? '***' + process.env.B2_ACCESS_KEY_ID.slice(-10) : 'not set',
    secretKey: process.env.B2_SECRET_ACCESS_KEY ? '***' + process.env.B2_SECRET_ACCESS_KEY.slice(-3) : 'not set'
  });

  // Test different operations to identify the issue
  try {
    // Test 1: Try to create the test file
    console.log('\nTest 1: Creating test file...');
    const testContent = 'This is a test file for B2 connection ' + new Date().toISOString();
    const testFileName = 'test-upload.txt';
    fs.writeFileSync(testFileName, testContent);
    console.log('✅ Created test file:', testFileName);

    // Test 2: Try to upload the test file
    console.log('\nTest 2: Uploading test file to B2...');
    try {
      const fileContent = fs.readFileSync(testFileName);
      const uploadParams = {
        Bucket: B2_BUCKET_NAME,
        Key: `test-${Date.now()}.txt`,
        Body: fileContent,
        ContentType: 'text/plain'
      };
      
      const uploadResult = await b2.upload(uploadParams).promise();
      console.log('✅ Successfully uploaded file to B2:', uploadResult.Location);
    } catch (error) {
      console.error('❌ Failed to upload file:', error.message);
      console.error('Error details:', error);
    }
    
    // Clean up the test file
    fs.unlinkSync(testFileName);
    console.log('Cleaned up test file');

    // Test 3: List objects in the bucket
    console.log('\nTest 3: Listing objects in bucket...');
    try {
      const listResult = await b2.listObjectsV2({
        Bucket: B2_BUCKET_NAME,
        MaxKeys: 5
      }).promise();
      
      console.log('✅ Successfully listed objects in bucket');
      if (listResult.Contents && listResult.Contents.length > 0) {
        console.log('Objects found:', listResult.Contents.map(item => item.Key));
      } else {
        console.log('Bucket is empty');
      }
    } catch (error) {
      console.error('❌ Failed to list objects:', error.message);
      console.error('Error details:', error);
    }

  } catch (error) {
    console.error('\n❌ Unexpected error:', error.message);
    console.error('Error details:', error);
  }
}

// Run the tests
testB2Connection(); 