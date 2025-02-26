const studentsServices = require("../services/students");
const validator = require('../services/validator')
const studentsControllers = {
    create: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                firstName: validator.name({ required: { value: true } }),
                lastName: validator.name({ required: { value: true } }),
                courseId: validator.id({ required: { value: false } }),
                birthDate: validator.date({ required: { value: false } }),
                additionalInfo: validator.anyObject(),
                avatarFileId: validator.id({ required: { value: false } }),
                filesIds: validator.ids({ required: { value: false } })
            })
            const { firstName, lastName, courseId, avatarFileId, birthDate, additionalInfo, filesIds } = await validator.validate(schema, req.body)
            await studentsServices.create({ firstName, lastName, courseId, organizationId: req.user.organizationId, avatarFileId, birthDate, additionalInfo, filesIds })
            res.send('Created')
        } catch (error) {
            next(error)
        }
    },
    edit: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                id: validator.id(),
                firstName: validator.name({ required: { value: true } }),
                lastName: validator.name({ required: { value: true } }),
                courseId: validator.id({ required: { value: false } }),
                birthDate: validator.date({ required: { value: false } }),
                additionalInfo: validator.anyObject(),
                avatarFileId: validator.id({ required: { value: false } }),
                filesIds: validator.ids({ required: { value: false } })
            })
            const { id, firstName, lastName, courseId, avatarFileId, birthDate, additionalInfo, filesIds } = await validator.validate(schema, { ...req.body, id: req.params.id })
            await studentsServices.editOne({ id, firstName, lastName, courseId, user: req.user, avatarFileId, birthDate, additionalInfo, filesIds })
            res.send('Edited')
        } catch (error) {
            next(error)
        }
    },
    getAll: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                withCourse: validator.boolean({ required: { value: false } }),
                courseId: validator.id({ required: { value: false } })
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
                id: validator.id(),
            })
            const { id } = await validator.validate(schema, { id: req.params.id })
            const student = await studentsServices.getOne({ id, user: req.user })
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
