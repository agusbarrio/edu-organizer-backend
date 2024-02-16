const filesRepositories = require("../repositories/files");
const fileSystemServices = require("./fileSystem");


const fileUploadServices = {
    createOne: async ({ file, organizationId }) => {
        const path = await fileSystemServices.saveFile(file);
        await filesRepositories.create({ organizationId, path });
    },
}

module.exports = fileUploadServices;