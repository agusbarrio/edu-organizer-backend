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
                _id: validator._id(),
            })
            const { _id } = await validator.validate(schema, { _id: req.params._id })
            const classSession = await classSessionsServices.getOne({ _id, organizationId: req.user.organization._id })
            res.json(classSession)
        } catch (error) {
            next(error)
        }
    },
    deleteOne: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                _id: validator._id(),
            })
            const { _id } = await validator.validate(schema, { _id: req.params._id })
            await classSessionsServices.deleteOne({ _id, user: req.user })
            res.send('Deleted')
        } catch (error) {
            next(error)
        }
    },
    edit: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                _id: validator._id(),
                date: validator.date({ required: { value: true }, max: { value: moment() } }),
            })
            const { date, _id } = await validator.validate(schema, { ...req.body, _id: req.params._id })
            await classSessionsServices.editOne({ _id, user: req.user, presentStudentsData: req.body.presentStudentsData, date })
            res.send('Class session saved')
        } catch (error) {
            next(error)
        }
    },
}

module.exports = classSessionsControllers;
