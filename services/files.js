const filesRepositories = require("../repositories/files");
const fileSystemServices = require("./fileSystem");
const db = require("../models");

const fileUploadServices = {
    createOne: async ({ file, organizationId }) => {
        return await db.sequelize.transaction(async (t) => {
            const result = await filesRepositories.create({ organizationId, path: file.path, mimetype: file.mimetype, name: file.originalname }, t);
            const base64 = await fileSystemServices.getBase64(result);

            return { id: result.id, file: base64, name: file.name, mimetype: file.mimetype };
        });
    },
    deleteOne: async ({ id }) => {
        return await db.sequelize.transaction(async (t) => {
            const file = await filesRepositories.getById(id, t);
            await fileSystemServices.deleteFile(file.path);
            await filesRepositories.deleteById(id, t);
        });
    }
}

module.exports = fileUploadServices;