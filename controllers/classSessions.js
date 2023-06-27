const classSessionsServices = require("../services/classSessions");
const validator = require('../services/validator')
const classSessionsControllers = {
    getAll: async (req, res, next) => {
        try {
            const classSessions = await classSessionsServices.getAll({ user: req.user })
            res.json(classSessions)
        } catch (error) {
            next(error)
        }
    },
    getOne: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                id: validator.id(),
            })
            const { id } = await validator.validate(schema, { id: req.params.id })
            const classSession = await classSessionsServices.getOne({ id, organizationId: req.user.organizationId })
            res.json(classSession)
        } catch (error) {
            next(error)
        }
    },
}

module.exports = classSessionsControllers;
