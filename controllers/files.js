const ERRORS = require("../constants/errors")
const fileUploadServices = require("../services/files")

const filesControllers = {
    createOne: async (req, res, next) => {
        try {
            const file = req.file
            const entity = req.user ? req.user : req.course
            let organizationId = entity?.organizationId
            if (!file) throw { ...ERRORS.E422, data: { reason: 'File is required' } }
            const result = await fileUploadServices.createOne({ file, organizationId })
            res.json(result)
        } catch (error) {
            next(error)
        }
    },
    clearUnusedFiles: async (req, res, next) => {
        try {
            await fileUploadServices.clearUnusedFiles()
            res.json({ message: 'Files cleared' })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = filesControllers;
