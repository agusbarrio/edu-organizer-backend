const courseServices = require("../services/course");
const validator = require('../services/validator')
const courseControllers = {
    create: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                name: validator.text({ required: { value: true } }),
                accessPin: validator.text({ required: { value: false } })
            })
            const { name, accessPin } = await validator.validate(schema, req.body)
            await courseServices.create({ name, accessPin, user: req.user })
            res.send('Created')
        } catch (error) {
            next(error)
        }
    },
    edit: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                id: validator.id(),
                name: validator.text({ required: { value: true } }),
                accessPin: validator.text({ required: { value: false } })
            })
            const { id, name, accessPin } = await validator.validate(schema, { name: req.body.name, accessPin: req.body.accessPin, id: req.params.id })
            await courseServices.editOne({ id, name, accessPin, user: req.user })
            res.send('Edited')
        } catch (error) {
            next(error)
        }
    },
    getAll: async (req, res, next) => {
        try {
            const courses = await courseServices.getAll({ user: req.user })
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
            await courseServices.deleteOne({ id, user: req.user })
            res.send('Deleted')
        } catch (error) {
            next(error)
        }
    },
}

module.exports = courseControllers;
