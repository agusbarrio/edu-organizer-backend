const userRepositories = require("../repositories/user");
const _ = require("lodash");
const { USER_VARIANTS } = require("../repositories/variants/user");

const usersServices = {
    getAll: async function () {
        const users = await userRepositories.getAll(USER_VARIANTS.FULL)
        return users
    },
}

module.exports = usersServices;