const { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const fs = require('fs');
const ERRORS = require('../constants/errors');
const { envConfig } = require('../config/envConfig');

let client;
let signingClient;

function assertConfig() {
    if (!envConfig.RUSTFS_ENDPOINT || !envConfig.RUSTFS_BUCKET || !envConfig.RUSTFS_ACCESS_KEY_ID || !envConfig.RUSTFS_SECRET_ACCESS_KEY) {
        throw { ...ERRORS.E500, data: { reason: 'Object storage is not configured' } };
    }
}

function createClient(endpoint) {
    return new S3Client({
        region: envConfig.RUSTFS_REGION,
        endpoint,
        forcePathStyle: true,
        credentials: {
            accessKeyId: envConfig.RUSTFS_ACCESS_KEY_ID,
            secretAccessKey: envConfig.RUSTFS_SECRET_ACCESS_KEY,
        },
        requestChecksumCalculation: 'WHEN_REQUIRED',
        responseChecksumValidation: 'WHEN_REQUIRED',
    });
}

function getClient() {
    assertConfig();
    if (!client) client = createClient(envConfig.RUSTFS_ENDPOINT);
    return client;
}

function getSigningClient() {
    assertConfig();
    if (!signingClient) {
        const endpoint = envConfig.RUSTFS_PUBLIC_ENDPOINT || envConfig.RUSTFS_ENDPOINT;
        signingClient = endpoint === envConfig.RUSTFS_ENDPOINT ? getClient() : createClient(endpoint);
    }
    return signingClient;
}

function isObjectKey(filePath) {
    return typeof filePath === 'string'
        && /^[^/\\]+\/[^/\\]+$/.test(filePath)
        && !filePath.startsWith('uploads/');
}

function isMissingObject(error) {
    return error?.name === 'NotFound'
        || error?.name === 'NoSuchKey'
        || error?.$metadata?.httpStatusCode === 404;
}

const fileSystemServices = {
    isObjectKey,
    putFile: async function ({ key, body, contentType }) {
        try {
            await getClient().send(new PutObjectCommand({
                Bucket: envConfig.RUSTFS_BUCKET,
                Key: key,
                Body: body,
                ContentType: contentType,
            }));
        } catch (error) {
            if (error?.errorCode) throw error;
            throw ERRORS.E500_3;
        }
    },
    deleteFile: async function (filePath) {
        if (!filePath) return;
        if (!isObjectKey(filePath)) {
            try {
                await fs.promises.unlink(filePath);
            } catch (error) {
                if (error.code !== 'ENOENT') throw ERRORS.E500_2;
            }
            return;
        }
        try {
            await getClient().send(new DeleteObjectCommand({
                Bucket: envConfig.RUSTFS_BUCKET,
                Key: filePath,
            }));
        } catch (error) {
            if (error?.errorCode) throw error;
            throw ERRORS.E500_2;
        }
    },
    fileExists: async function (filePath) {
        if (!filePath) return false;
        if (!isObjectKey(filePath)) {
            try {
                await fs.promises.access(filePath, fs.constants.F_OK);
                return true;
            } catch {
                return false;
            }
        }
        try {
            await getClient().send(new HeadObjectCommand({
                Bucket: envConfig.RUSTFS_BUCKET,
                Key: filePath,
            }));
            return true;
        } catch (error) {
            if (isMissingObject(error)) return false;
            if (error?.errorCode) throw error;
            throw ERRORS.E500;
        }
    },
    getSignedUrl: async function (key) {
        try {
            return await getSignedUrl(
                getSigningClient(),
                new GetObjectCommand({
                    Bucket: envConfig.RUSTFS_BUCKET,
                    Key: key,
                }),
                { expiresIn: envConfig.RUSTFS_SIGNED_URL_EXPIRES_SECONDS }
            );
        } catch (error) {
            if (error?.errorCode) throw error;
            throw ERRORS.E500;
        }
    },
    readLocalFile: async function (filePath) {
        try {
            return await fs.promises.readFile(filePath);
        } catch {
            return null;
        }
    },
};

module.exports = fileSystemServices;
