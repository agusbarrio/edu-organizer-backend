const userRepositories = require("../repositories/user");
const _ = require("lodash");
const { USER_VARIANTS } = require("../repositories/variants/user");
const encryptationServices = require('./encryptation');

const usersServices = {
    getAll: async function () {
        const users = await userRepositories.getAll(USER_VARIANTS.FULL)
        return users
    },
    getMyUser: async function ({ user }) {
        const myUser = await userRepositories.getOneById(user.id)
        return myUser
    },
    editMyUser: async function ({ firstName, lastName, user }) {
        await userRepositories.editOneById(user.id, { firstName, lastName })
    },
    changePassword: async function ({ newPassword, user }) {
        const encryptedPassword = await encryptationServices.convertTextToHash(newPassword);
        await userRepositories.editOneById(user.id, { password: encryptedPassword })
    }
}

module.exports = usersServices;