const organizationsServices = require("../services/organizations");
const validator = require('../services/validator')
const organizationControllers = {
    getMyOrganization: async (req, res, next) => {
        try {
            const organization = await organizationsServices.getMyOrganization({ user: req.user })
            res.json(organization)
        } catch (error) {
            next(error)
        }
    },
    editMyOrganization: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                name: validator.text({ required: { value: true } }),
            })
            const { name } = await validator.validate(schema, req.body)
            await organizationsServices.editMyOrganization({ name, user: req.user })
            res.send('Edited')
        } catch (error) {
            next(error)
        }
    }
}
module.exports = organizationControllers;
