const _ = require("lodash");
const User = require("../models/user");
const encryptationServices = require('./encryptation');

const usersServices = {
    getAll: async function () {
        const users = await User.find({})
        return users
    },
    getMyUser: async function ({ user }) {
        const myUser = await User.findOne({ _id: user._id })
        return myUser
    },
    editMyUser: async function ({ firstName, lastName, user }) {
        await User.updateOne({ _id: user._id }, { firstName, lastName })
    },
    changePassword: async function ({ newPassword, user }) {
        const encryptedPassword = await encryptationServices.convertTextToHash(newPassword);
        await User.updateOne({ _id: user._id }, { password: encryptedPassword })
    }
}

module.exports = usersServices;