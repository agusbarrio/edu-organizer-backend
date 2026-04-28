const userRepositories = require("../repositories/user");
const _ = require("lodash");
const { USER_VARIANTS } = require("../repositories/variants/user");
const encryptationServices = require('./encryptation');
const userPermissionServices = require('./userPermission');
const db = require("../models");
const ERRORS = require("../constants/errors");
const { USER_PERMISSIONS } = require("../constants/userPermission");
const { STATUSES } = require("../constants/user");
const { TOKENS } = require("../constants/auth");
const EMAIL_TEMPLATES = require("../constants/emailTemplates");
const { sendMail, getTemplate } = require("./emailNotifications");

async function sendCompleteAccountInvitationMail(targetUser) {
    const token = encryptationServices.createToken({ id: targetUser.id }, TOKENS.COMPLETE_ACCOUNT)
    const url = `${process.env.CORS_ORIGIN}/auth/complete-account?token=${token}`
    const mailContent = getTemplate(EMAIL_TEMPLATES.COMPLETE_ACCOUNT.key, { url })
    await sendMail(mailContent, targetUser.email)
}

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
    },
    getAllByOrganization: async function ({ user }) {
        const users = await userRepositories.getAll(USER_VARIANTS.FULL)
        return users.filter((targetUser) => targetUser.organizationId === user.organizationId)
    },
    createByOrganization: async function ({ email, firstName, lastName, permissions, user }) {
        const existingUser = await userRepositories.getOneByEmail(email, USER_VARIANTS.EXISTS)
        if (existingUser) throw ERRORS.E409_1
        await db.sequelize.transaction(async (t) => {
            const createdUser = await userRepositories.create({
                email,
                firstName,
                lastName,
                organizationId: user.organizationId,
                status: STATUSES.PENDING,
                password: null,
            }, t)
            await userPermissionServices.setUserPermissions({ user: createdUser, permissions }, t)
            await sendCompleteAccountInvitationMail(createdUser)
        })
    },
    deleteByOrganization: async function ({ id, user }) {
        const targetUser = await userRepositories.getOneById(id)
        if (!targetUser) throw ERRORS.E404_1
        if (targetUser.organizationId !== user.organizationId) throw ERRORS.E403_1
        const targetUserWithPermissions = await userRepositories.getOneByIdWithLoginInclude(id)
        const targetPermissions = (targetUserWithPermissions?.permissions || []).map((permission) => permission.permission)
        if (targetPermissions.includes(USER_PERMISSIONS.OWNER)) throw ERRORS.E403_3
        await userRepositories.deleteById(id)
    },
    resendInvitationByOrganization: async function ({ id, user }) {
        const targetUser = await userRepositories.getOneById(id)
        if (!targetUser) throw ERRORS.E404_1
        if (targetUser.organizationId !== user.organizationId) throw ERRORS.E403_1
        if (targetUser.status === STATUSES.ACTIVE) throw ERRORS.E409_3
        await sendCompleteAccountInvitationMail(targetUser)
    },
    editPermissionsByOrganization: async function ({ id, permissions = [], user }) {
        const targetUser = await userRepositories.getOneById(id)
        if (!targetUser) throw ERRORS.E404_1
        if (targetUser.organizationId !== user.organizationId) throw ERRORS.E403_1

        const targetUserWithPermissions = await userRepositories.getOneByIdWithLoginInclude(id)
        const targetPermissions = (targetUserWithPermissions?.permissions || []).map((permission) => permission.permission)
        const targetIsOwner = targetPermissions.includes(USER_PERMISSIONS.OWNER)

        if (permissions.includes(USER_PERMISSIONS.OWNER)) throw ERRORS.E403_5
        if (targetIsOwner && user.id !== targetUser.id) throw ERRORS.E403_4

        const nextPermissions = targetIsOwner
            ? _.uniq([...permissions, USER_PERMISSIONS.OWNER])
            : permissions

        await db.sequelize.transaction(async (t) => {
            await userPermissionServices.setUserPermissions({ user: targetUser, permissions: nextPermissions }, t)
        })
    },
}

module.exports = usersServices;