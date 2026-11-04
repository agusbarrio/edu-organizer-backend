const filesRepositories = require("../repositories/files");
const fileSystemServices = require("./fileSystem");
const db = require("../models");
const mime = require("mime-types");
const { v4: uuidv4 } = require("uuid");

const pendingPromotions = new Map();

function extensionFor(mimetype) {
    return mime.extension(mimetype) || "bin";
}

async function promoteLocalFile(fileEntity) {
    const data = await fileSystemServices.readLocalFile(fileEntity.path);
    if (!data) {
        const current = await filesRepositories.getOneById(fileEntity.id);
        if (current && fileSystemServices.isObjectKey(current.path)) {
            return current.path;
        }
        return null;
    }
    const key = `${fileEntity.organizationId}/${fileEntity.id}.${extensionFor(fileEntity.mimetype)}`;
    await fileSystemServices.putFile({ key, body: data, contentType: fileEntity.mimetype });
    await filesRepositories.editOneById(fileEntity.id, { path: key });
    await fileSystemServices.deleteFile(fileEntity.path).catch(() => { });
    return key;
}

function resolveKey(fileEntity) {
    if (fileSystemServices.isObjectKey(fileEntity.path)) {
        return fileEntity.path;
    }
    const inFlight = pendingPromotions.get(fileEntity.id);
    if (inFlight) return inFlight;
    const pending = promoteLocalFile(fileEntity).finally(() => {
        if (pendingPromotions.get(fileEntity.id) === pending) {
            pendingPromotions.delete(fileEntity.id);
        }
    });
    pendingPromotions.set(fileEntity.id, pending);
    return pending;
}

const fileUploadServices = {
    createOne: async ({ file, organizationId }) => {
        const key = `${organizationId}/${uuidv4()}.${extensionFor(file.mimetype)}`;
        await fileSystemServices.putFile({ key, body: file.buffer, contentType: file.mimetype });
        try {
            return await db.sequelize.transaction(async (t) => {
                const result = await filesRepositories.create({ organizationId, path: key, mimetype: file.mimetype, name: file.originalname }, t);
                const url = await fileSystemServices.getSignedUrl(key);
                return { id: result.id, file: url, name: result.name, mimetype: result.mimetype };
            });
        } catch (error) {
            await fileSystemServices.deleteFile(key).catch(() => { });
            throw error;
        }
    },
    deleteOne: async ({ id }) => {
        return await db.sequelize.transaction(async (t) => {
            const file = await filesRepositories.getOneById(id, t);
            await fileSystemServices.deleteFile(file.path);
            await filesRepositories.deleteById(id, t);
        });
    },
    getAccessUrl: async (fileEntity) => {
        const key = await resolveKey(fileEntity);
        if (!key) return null;
        return fileSystemServices.getSignedUrl(key);
    },
    getAccessUrls: async (fileEntities) => {
        return await Promise.all(fileEntities.map(async (fileEntity) => {
            return await fileUploadServices.getAccessUrl(fileEntity);
        }));
    },
    clearUnusedFiles: async () => {
        const files = await filesRepositories.getUnusedFiles();
        await db.sequelize.transaction(async (t) => {
            await Promise.all(files.map(async file => {
                const exists = await fileSystemServices.fileExists(file.path);
                if (exists) {
                    await fileSystemServices.deleteFile(file.path);
                }
            }
            ));
            await filesRepositories.deleteById(files.map(file => file.id), t);
        });
    }
};

module.exports = fileUploadServices;
