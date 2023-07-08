const moment = require("moment");
const classSessionsServices = require("../services/classSessions");
const validator = require('../services/validator');
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
    deleteOne: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                id: validator.id(),
            })
            const { id } = await validator.validate(schema, { id: req.params.id })
            await classSessionsServices.deleteOne({ id, user: req.user })
            res.send('Deleted')
        } catch (error) {
            next(error)
        }
    },
    edit: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                id: validator.id(),
                date: validator.date({ required: { value: true }, max: { value: moment() } }),
            })
            const { date, id } = await validator.validate(schema, { ...req.body, id: req.params.id })
            await classSessionsServices.editOne({ id, user: req.user, presentStudentsData: req.body.presentStudentsData, date })
            res.send('Class session saved')
        } catch (error) {
            next(error)
        }
    },
}

module.exports = classSessionsControllers;
