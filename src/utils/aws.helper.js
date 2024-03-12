const AWS = require("aws-sdk");
require("dotenv").config();

const uploadToAws = (photo, path) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const s3 = new AWS.S3();
      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      });
      const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: `${path}`,
        Body: photo,
        ACL: "public-read",
        ContentEncoding: "base64",
      };
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    } catch (error) {
      reject(err);
    }
  });
};

const deleteFromAWS = (key) => {
  return new Promise((resolve, reject) => {
    try {
      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      });
      var params = {
        Bucket: process.env.AWS_BUCKET,
        Key: `${key}`,
      };
      s3.deleteObject(params, (err, data) => {
        if (err) {
          reject();
        } else {
          resolve(data);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  deleteFromAWS,
  uploadToAws,
};
