const studentServices = require("../services/student");
const validator = require('../services/validator')
const studentControllers = {
    create: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                firstName: validator.text({ required: { value: true } }),
                lastName: validator.text({ required: { value: true } }),
                courseId: validator.id({ required: { value: false } })
            })
            const { firstName, lastName, courseId } = await validator.validate(schema, req.body)
            await studentServices.create({ firstName, lastName, courseId, user: req.user })
            res.send('Created')
        } catch (error) {
            next(error)
        }
    },
    edit: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                id: validator.id(),
                firstName: validator.text({ required: { value: true } }),
                lastName: validator.text({ required: { value: true } }),
                courseId: validator.id({ required: { value: false } })
            })
            const { id, firstName, lastName, courseId } = await validator.validate(schema, { ...req.body, id: req.params.id })
            await studentServices.editOne({ id, firstName, lastName, courseId, user: req.user })
            res.send('Edited')
        } catch (error) {
            next(error)
        }
    },
    getAll: async (req, res, next) => {
        try {
            const courses = await studentServices.getAll({ user: req.user })
            res.json(courses)
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
            await studentServices.deleteOne({ id, user: req.user })
            res.send('Deleted')
        } catch (error) {
            next(error)
        }
    }
}

module.exports = studentControllers;
