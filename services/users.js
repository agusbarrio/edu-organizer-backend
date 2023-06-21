const db = require("../models");
const userRepositories = require("../repositories/user");
const organizationRepositories = require("../repositories/organization");
const _ = require("lodash");
const { STATUSES } = require("../constants/user");
const ERRORS = require("../constants/errors");
const { USER_VARIANTS } = require("../repositories/variants/user");

const usersServices = {
    allowRegistration: async function ({ id }) {
        await db.sequelize.transaction(async (t) => {
            const user = await userRepositories.getOneById(id, t)
            if (!user) throw ERRORS.E404_1
            if (user.status !== STATUSES.PENDING) throw ERRORS.E409_2
            user.status = STATUSES.ACTIVE
            await user.save({ transaction: t })
        })
    },
    denyRegistration: async function ({ id }) {
        await db.sequelize.transaction(async (t) => {
            const user = await userRepositories.getOneById(id, t)
            if (!user) throw ERRORS.E404_1
            if (user.status !== STATUSES.PENDING) throw ERRORS.E409_2
            // elimino fisicamente la organizacion
            await organizationRepositories.deleteById(user.organizationId, t, { force: true })
        })
    },
    getAll: async function () {
        const users = await userRepositories.getAll(USER_VARIANTS.FULL)
        return users
    },
}

module.exports = usersServices;