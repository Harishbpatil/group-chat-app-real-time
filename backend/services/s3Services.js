const AWS = require("aws-sdk");
require("dotenv").config();

function uploadToS3(data, fileName) {
  const s3Bucket = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  });
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: data,
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    s3Bucket.upload(params, function (err, data) {
      if (err) reject(err);

      resolve(data);
    });
  });
}

module.exports = { uploadToS3 };
