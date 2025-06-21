import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import S3Client from '../config/aws/s3Client';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Define the types for the S3 upload and delete parameters
interface S3UploadParams {
  fileBuffer: Buffer;
  fileName: string;
  mimeType: string;
}

interface S3DeleteParams {
  fileName: string;
}

/**
 * Uploads a file buffer to AWS S3.
 * @param {Buffer} fileBuffer - The file buffer.
 * @param {string} fileName - The name of the file.
 * @param {string} mimeType - The MIME type of the file.
 * @returns {Promise<string>} - The URL of the uploaded file.
 */
const uploadToS3 = async ({ fileBuffer, fileName, mimeType }: S3UploadParams): Promise<string> => {
  const params = {
    Bucket: process.env.BUCKET_NAME!,
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimeType,
    // ACL: ObjectCannedACL.public_read,
  };

  const command = new PutObjectCommand(params);
  await S3Client.send(command);

  return `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${fileName}`;
};

/**
 * Gets a file from AWS S3. This method use to get image from aws s3.
 * But in our project, we will get image from cloudfront url.
 * @param {string} fileName - The name of the file.
 * @returns {Promise<string>} - The URL of the file.
 */
const getFromS3 = async (fileName: string): Promise<string> => {
  const params = {
    Bucket: process.env.BUCKET_NAME!,
    Key: fileName,
  };
  const command = new GetObjectCommand(params);
  const url = await getSignedUrl(S3Client, command, { expiresIn: 5 * 60 * 60 }); // Expiry in seconds
  return url;
};

/**
 * Deletes a file from AWS S3.
 * @param {string} fileName - The name of the file.
 * @returns {Promise<boolean>} - True if the file was deleted successfully.
 */
const deleteFromS3 = async ({ fileName }: S3DeleteParams): Promise<boolean> => {
  const params = {
    Bucket: process.env.BUCKET_NAME!,
    Key: fileName,
  };
  const command = new DeleteObjectCommand(params);
  await S3Client.send(command);
  return true;
};

export { uploadToS3, getFromS3, deleteFromS3 };
