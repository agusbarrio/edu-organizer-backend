const ERRORS = require("../constants/errors");
const fs = require('fs');


const fileSystemServices = {
    deleteFile: async function (path) {
        return new Promise((resolve, reject) => {
            fs.unlink(path, (err) => {
                if (err) {
                    reject(ERRORS.E500_2);
                }
                resolve(path);
            });
        });
    },
    appendFile: async function ({ obj, fieldName, file }) {
        return { ...obj, [fieldName]: file }
    },
    readFile: async function (path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (
                err,
                data
            ) => {
                resolve(data);
            });
        });
    },
    getBase64: async function (fileEntity) {
        const base64Url = `data:${fileEntity.mimetype};base64,`;
        const data = await fileSystemServices.readFile(fileEntity.path);
        if (!data) return null;
        return base64Url + data.toString('base64');
    },
    fileExists: async function (path) {
        return new Promise((resolve) => {
            fs.access(path, fs.constants.F_OK, (err) => {
                if (err) {
                    resolve(false);
                }
                resolve(true);
            });
        });
    }
}

module.exports = fileSystemServices;