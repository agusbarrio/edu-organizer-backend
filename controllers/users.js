const usersServices = require("../services/users");
const validator = require('../services/validator')

const usersControllers = {
    getAll: async (req, res, next) => {
        try {
            const users = await usersServices.getAll()
            res.json(users)
        } catch (error) {
            next(error)
        }
    },
    getAllByOrganization: async (req, res, next) => {
        try {
            const users = await usersServices.getAllByOrganization({ user: req.user })
            res.json(users)
        } catch (error) {
            next(error)
        }
    },
    createByOrganization: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                email: validator.email({ required: { value: true } }),
                firstName: validator.name({ required: { value: true } }),
                lastName: validator.name({ required: { value: true } }),
                permissions: validator.array({ required: { value: true } }).of(validator.oneOf(['ADMIN', 'TEACHER'], { required: { value: true } }))
            })
            const { email, firstName, lastName, permissions } = await validator.validate(schema, req.body)
            await usersServices.createByOrganization({ email, firstName, lastName, permissions, user: req.user })
            res.send('Created')
        } catch (error) {
            next(error)
        }
    },
    deleteByOrganization: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                id: validator.id({ required: { value: true } })
            })
            const { id } = await validator.validate(schema, { id: req.params.id })
            await usersServices.deleteByOrganization({ id, user: req.user })
            res.send('Deleted')
        } catch (error) {
            next(error)
        }
    },
    resendInvitationByOrganization: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                id: validator.id({ required: { value: true } })
            })
            const { id } = await validator.validate(schema, { id: req.params.id })
            await usersServices.resendInvitationByOrganization({ id, user: req.user })
            res.send('Invitation resent')
        } catch (error) {
            next(error)
        }
    },
    editPermissionsByOrganization: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                id: validator.id({ required: { value: true } }),
                permissions: validator.array({ required: { value: true } }).of(validator.oneOf(['ADMIN', 'TEACHER'], { required: { value: true } }))
            })
            const { id, permissions } = await validator.validate(schema, { id: req.params.id, permissions: req.body.permissions })
            await usersServices.editPermissionsByOrganization({ id, permissions, user: req.user })
            res.send('Permissions edited')
        } catch (error) {
            next(error)
        }
    },
}

module.exports = usersControllers;
