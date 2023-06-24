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
}

module.exports = classSessionsControllers;
