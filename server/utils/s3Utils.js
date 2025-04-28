const {
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} = require("@aws-sdk/client-s3");
const s3 = require("../config/awsClient");

const uploadFileToS3 = async (fileBuffer, filePath, mimetype) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: filePath,
    Body: fileBuffer,
    ContentType: mimetype,
    ACL: "private",
  };

  try {
    await s3.send(new PutObjectCommand(params));
    return { filePath, bucket: process.env.BUCKET_NAME };
  } catch (error) {
    console.error(`Error uploading file ${filePath}:`, error);
    throw new Error("File upload failed");
  }
};

async function deleteS3Object(filePath) {
  const params = { Bucket: process.env.BUCKET_NAME, Key: filePath };
  const command = new DeleteObjectCommand(params);

  try {
    const response = await s3.send(command);
    console.log(`Deleted object: ${key}`);
    return response;
  } catch (error) {
    console.error(`Error deleting object: ${error.message}`);
    throw error;
  }
}

// Function to check if a folder in S3 is empty
async function isFolderEmpty(bucketName, prefix) {
  const params = { Bucket: bucketName, Prefix: prefix };
  const command = new ListObjectsV2Command(params);

  try {
    const data = await s3.send(command);
    const isEmpty = !(data && data.Contents && data.Contents.length > 0);
    return isEmpty;
  } catch (error) {
    console.error(`Error listing objects: ${error.message}`);
    throw error;
  }
}

// Function to delete a folder from S3
async function deleteS3Folder(bucketName, folderPath) {
  const params = { Bucket: bucketName, Key: folderPath };
  const command = new DeleteObjectCommand(params);

  try {
    const response = await s3.send(command);
    console.log(`Deleted folder: ${folderKey}`);
    return response;
  } catch (error) {
    console.error(`Error deleting folder: ${error.message}`);
    throw error;
  }
}

module.exports = {
  uploadFileToS3,
  deleteS3Object,
  isFolderEmpty,
  deleteS3Folder,
};
