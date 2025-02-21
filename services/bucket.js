const { envConfig } = require("../config/envConfig");
const s3Client = require("../config/r2Config");

const urlsCache = new Map();

const bucketService = {
    uploadFile: async ({ file, key }) => {
        const upload = s3Client.upload({
            Bucket: envConfig.R2_BUCKET_NAME,
            Key: key,
            Body: file,
            ContentType: file.mimetype
        })

        return upload.promise()
    },
    uploadMultipleFiles: async (files) => {
        const uploadPromises = files.map(({ file, key }) => {
            const upload = s3Client.upload({
                Bucket: envConfig.R2_BUCKET_NAME,
                Key: key,
                Body: file,
                ContentType: file.mimetype
            })
            return upload.promise()
        })

        return Promise.allSettled(uploadPromises)
    },

    deleteFile: async (key) => {
        const del = s3Client.deleteObject({
            Bucket: envConfig.R2_BUCKET_NAME,
            Key: key
        })
        return del.promise()
    },
    deleteFilesByPrefix: async (prefix) => {
        const del = s3Client.deleteObjects({
            Bucket: envConfig.R2_BUCKET_NAME,
            Delete: { Prefix: prefix }
        })
        return del.promise()
    },

    getSignedUrl: async (key, expirationSeconds = 60) => {
        const now = Date.now();
        const cacheKey = key;

        if (urlsCache.has(cacheKey)) {
            const cached = urlsCache.get(cacheKey);
            const timeUntilExpiry = cached.expiresAt - now;
            const timeToExpiry = 10 * 1000
            if (timeUntilExpiry > timeToExpiry) {
                return cached.url;
            }
        }

        const params = {
            Bucket: envConfig.R2_BUCKET_NAME,
            Key: key,
            Expires: expirationSeconds
        }

        const url = await s3Client.getSignedUrlPromise('getObject', params)

        urlsCache.set(cacheKey, {
            url,
            expiresAt: now + (expirationSeconds * 1000)
        })
        return url
    }


}

module.exports = bucketService;