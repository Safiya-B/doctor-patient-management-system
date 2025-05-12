const {
  PutObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const {
  getSignedUrl,
  S3RequestPresigner,
} = require("@aws-sdk/s3-request-presigner");
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

const deleteS3Object = async (filesPath) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Delete: {
      Objects: filesPath,
    },
  };
  const command = new DeleteObjectsCommand(params);

  try {
    const response = await s3.send(command);

    return response;
  } catch (error) {
    console.error(`Error deleting object: ${error.message}`);
    throw error;
  }
};

const generateS3Url = async (filePath) => {
  const params = { Bucket: process.env.BUCKET_NAME, Key: filePath };
  const command = new GetObjectCommand(params);

  const url = await getSignedUrl(s3, command, { expiresIn: 60 });

  return url;
};

module.exports = {
  uploadFileToS3,
  deleteS3Object,
  generateS3Url,
};
