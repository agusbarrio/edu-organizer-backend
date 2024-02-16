const ERRORS = require("../constants/errors");
const fs = require('fs');
const encryptationServices = require("./encryptation");


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
    saveFile: async function (file) {
        //return file
        return new Promise((resolve, reject) => {
            const path = `uploads/${encryptationServices.uuidv4()}`;

            fs.rename(file.path, path, (err) => {
                if (err) {
                    reject(ERRORS.E500_3);
                }
                resolve(path);
            });
        });
    }
}

module.exports = fileSystemServices;