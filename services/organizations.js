const ERRORS = require("../constants/errors");
const db = require("../models");
const organizationRepositories = require("../repositories/organization");

const { validTargetStudent, validTargetCourse } = require("./targetEntities");

const organizationsServices = {
    getAll: async function () {
        const organizations = await organizationRepositories.getAll()
        return organizations
    },
    deleteOne: async function ({ id }) {
        await db.sequelize.transaction(async (t) => {
            await organizationRepositories.deleteById(id, t)
        })
    },
    getMyOrganization: async function ({ user }) {
        const organization = await organizationRepositories.getOneById(user.organizationId)
        return organization
    },
    editMyOrganization: async function ({ name, user }) {
        await organizationRepositories.editOneById(user.organizationId, { name })
    },
}

module.exports = organizationsServices;