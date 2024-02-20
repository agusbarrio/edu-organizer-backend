const multer = require('multer')
const ERRORS = require('../constants/errors')
const { envConfig } = require('../config/envConfig')

const storage = multer.diskStorage({
    destination: envConfig.MULTER_DESTINATION,
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const ext = file.originalname.split('.').pop()
        const filename = `file-${uniqueSuffix}.${ext}`
        cb(null, filename)
    }
})

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