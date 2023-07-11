const studentsServices = require("../services/students");
const validator = require('../services/validator')
const studentsControllers = {
    create: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                firstName: validator.text({ required: { value: true } }),
                lastName: validator.text({ required: { value: true } }),
                courseId: validator._id({ required: { value: false } })
            })
            const { firstName, lastName, courseId } = await validator.validate(schema, req.body)
            await studentsServices.create({ firstName, lastName, courseId, organizationId: req.user.organization._id })
            res.send('Created')
        } catch (error) {
            next(error)
        }
    },
    edit: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                _id: validator._id(),
                firstName: validator.text({ required: { value: true } }),
                lastName: validator.text({ required: { value: true } }),
                courseId: validator._id({ required: { value: false } })
            })
            const { _id, firstName, lastName, courseId } = await validator.validate(schema, { ...req.body, _id: req.params._id })
            await studentsServices.editOne({ _id, firstName, lastName, courseId, user: req.user })
            res.send('Edited')
        } catch (error) {
            next(error)
        }
    },
    getAll: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                withCourse: validator.boolean({ required: { value: false } }),
                courseId: validator._id({ required: { value: false } })
            })
            const { withCourse, courseId } = await validator.validate(schema, req.query)
            const students = await studentsServices.getAll({ user: req.user, withCourse, courseId })
            res.json(students)
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
            const student = await studentsServices.getOne({ _id, user: req.user })
            res.json(student)
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
            await studentsServices.deleteOne({ _id, user: req.user })
            res.send('Deleted')
        } catch (error) {
            next(error)
        }
    }
}

module.exports = studentsControllers;
