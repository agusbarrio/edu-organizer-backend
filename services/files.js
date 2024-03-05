const filesRepositories = require("../repositories/files");
const fileSystemServices = require("./fileSystem");
const db = require("../models");
const ERRORS = require("../constants/errors");

const fileUploadServices = {
    createOne: async ({ file, organizationId }) => {
        return await db.sequelize.transaction(async (t) => {
            const result = await filesRepositories.create({ organizationId, path: file.path, mimetype: file.mimetype, name: file.originalname }, t);
            const base64 = await fileSystemServices.getBase64(result);
            if (!base64) {
                throw ERRORS.E500_3
            }
            return { id: result.id, file: base64, name: result.name, mimetype: result.mimetype };
        });
    },
    deleteOne: async ({ id }) => {
        return await db.sequelize.transaction(async (t) => {
            const file = await filesRepositories.getOneById(id, t);
            await fileSystemServices.deleteFile(file.path);
            await filesRepositories.deleteById(id, t);
        });
    },
    cleanGetBase64: async (fileEntity) => {
        const base64 = await fileSystemServices.getBase64(fileEntity);
        if (base64) {
            return base64;
        } else {
            //clear file from db
            await filesRepositories.deleteById(fileEntity.id);
            return null;
        }
    },
    clearUnusedFiles: async () => {
        const files = await filesRepositories.getUnusedFiles();
        db.sequelize.transaction(async (t) => {
            await Promise.all(files.map(async file => {
                // Si existe el archivo lo borra
                const exists = await fileSystemServices.fileExists(file.path);
                if (exists) {
                    await fileSystemServices.deleteFile(file.path);
                }
            }
            ));
            await filesRepositories.deleteById(files.map(file => file.id), t);
        }
        );
    }
};

module.exports = fileUploadServices;
