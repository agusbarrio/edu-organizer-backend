const studentsServices = require("../services/students");
const validator = require('../services/validator')
const studentsControllers = {
    create: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                firstName: validator.text({ required: { value: true } }),
                lastName: validator.text({ required: { value: true } }),
                courseId: validator.id({ required: { value: false } })
            })
            const { firstName, lastName, courseId } = await validator.validate(schema, req.body)
            await studentsServices.create({ firstName, lastName, courseId, organizationId: req.user.organizationId })
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
            await studentsServices.editOne({ id, firstName, lastName, courseId, user: req.user })
            res.send('Edited')
        } catch (error) {
            next(error)
        }
    },
    getAll: async (req, res, next) => {
        try {
            const students = await studentsServices.getAll({ user: req.user })
            res.json(students)
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
            const student = await studentsServices.getOne({ id })
            res.json(student)
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
            await studentsServices.deleteOne({ id, user: req.user })
            res.send('Deleted')
        } catch (error) {
            next(error)
        }
    }
}

module.exports = studentsControllers;
