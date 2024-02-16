const ERRORS = require("../constants/errors")
const fileUploadServices = require("../services/files")

const filesControllers = {
    createOne: async (req, res, next) => {
        try {
            const file = req.file
            const organizationId = req.user.organizationId
            if (!file) throw { ...ERRORS.E422, data: { reason: 'File is required' } }
            await fileUploadServices.createOne({ file, organizationId })
            res.send('Uploaded')
        } catch (error) {
            next(error)
        }
    },
}

module.exports = filesControllers;
