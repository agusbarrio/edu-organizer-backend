const S3 = require("aws-sdk/clients/s3");
const { envConfig } = require("./envConfig");

const s3Client = new S3({
    endpoint: envConfig.R2_ENDPOINT,
    signatureVersion: "v4",
    credentials: {
        accessKeyId: envConfig.R2_ACCESS_KEY_ID,
        secretAccessKey: envConfig.R2_SECRET_ACCESS_KEY,
    }
});

module.exports = s3Client