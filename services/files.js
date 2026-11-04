const filesRepositories = require("../repositories/files");
const fileSystemServices = require("./fileSystem");
const db = require("../models");
const mime = require("mime-types");
const { v4: uuidv4 } = require("uuid");

function extensionFor(mimetype) {
    return mime.extension(mimetype) || "bin";
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
        if (!fileEntity?.path) return null;
        return fileSystemServices.getSignedUrl(fileEntity.path);
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
