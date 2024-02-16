const multer = require('multer')
const ERRORS = require('../constants/errors')
const { envConfig } = require('../config/envConfig')

const getUploader = (fileFilter) => multer({ dest: envConfig.MULTER_DESTINATION, fileFilter })

const filesMiddlewares = {
    uploadSingle: (fileFilter) => {
        return getUploader(fileFilter).single('file')
    },
    uploadMultiple: (max = 10, fileFilter) => {
        return getUploader(fileFilter).array('files', max)
    },
    filterImage: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb({ ...ERRORS.E400, data: { reason: 'The file is not an image' } }, false);
        }
    }
}

module.exports = filesMiddlewares;