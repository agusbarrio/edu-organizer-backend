const usersServices = require("../services/users");
const validator = require('../services/validator')
const usersControllers = {
    allowRegistration: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                id: validator.id(),
            })
            const { id } = await validator.validate(schema, { id: req.params.id })
            await usersServices.allowRegistration({ id })
            res.send('Registration allowed')
        } catch (error) {
            next(error)
        }
    },
    denyRegistration: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                id: validator.id(),
            })
            const { id } = await validator.validate(schema, { id: req.params.id })
            await usersServices.denyRegistration({ id })
            res.send('Registration denied')
        } catch (error) {
            next(error)
        }
    },
    getAll: async (req, res, next) => {
        try {
            const users = await usersServices.getAll()
            res.json(users)
        } catch (error) {
            next(error)
        }
    },
}

module.exports = usersControllers;
