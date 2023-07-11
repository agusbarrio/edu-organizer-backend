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
                _id: validator._id(),
            })
            const { _id } = await validator.validate(schema, { _id: req.params._id })
            await organizationsServices.deleteOne({ _id, user: req.user })
            res.send('Deleted')
        } catch (error) {
            next(error)
        }
    }
}

module.exports = organizationsControllers;
