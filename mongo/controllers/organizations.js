const organizationsServices = require("../services/organizations");
const validator = require('../services/validator')
const organizationsControllers = {
    getAll: async (req, res, next) => {
        try {
            const organizations = await organizationsServices.getAll()
            res.json(organizations)
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
            await organizationsServices.deleteOne({ id, user: req.user })
            res.send('Deleted')
        } catch (error) {
            next(error)
        }
    }
}

module.exports = organizationsControllers;
