const multer = require('multer')
const ERRORS = require('../constants/errors')
const storage = multer.memoryStorage()

const filesMiddlewares = {
    uploadSingle: (fileFilter) => {
        return multer({ storage, fileFilter }).single('file')
    },
    uploadMultiple: (max = 10, fileFilter) => {
        return multer({ storage, fileFilter }).array('files', max)
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
