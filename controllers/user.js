const usersServices = require("../services/users");
const validator = require('../services/validator')

const userControllers = {
    getMyUser: async (req, res, next) => {
        try {
            const user = await usersServices.getMyUser({ user: req.user })
            res.json(user)
        } catch (error) {
            next(error)
        }
    },
    editMyUser: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                firstName: validator.text({ required: { value: true } }),
                lastName: validator.text({ required: { value: true } }),
            })
            const { firstName, lastName } = await validator.validate(schema, { ...req.body })
            await usersServices.editMyUser({ firstName, lastName, user: req.user })
            res.send('Edited')
        } catch (error) {
            next(error)
        }
    },
}

module.exports = userControllers;
