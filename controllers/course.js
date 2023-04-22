const courseServices = require("../services/course");
const validator = require('../services/validator')
const courseControllers = {
    create: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                name: validator.text({ required: { value: true } })
            })
            const { name } = await validator.validate(schema, req.body)
            await courseServices.create({ name, user: req.user })
            res.send('Created')
        } catch (error) {
            next(error)
        }
    },
    edit: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                id: validator.id(),
                name: validator.text({ required: { value: true } })
            })
            const { id, name } = await validator.validate(schema, { name: req.body.name, id: req.params.id })
            await courseServices.editOne({ id, name, user: req.user })
            res.send('Edited')
        } catch (error) {
            next(error)
        }
    },
    getAll: async (req, res, next) => {
        try {
            console.log(req.user)
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
    }
}

module.exports = courseControllers;
