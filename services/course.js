const db = require("../models");
const courseRepositories = require("../repositories/course");
const encryptationServices = require("./encryptation");
const { validTargetCourse } = require("./targetEntities");

const courseServices = {
    create: async function ({ user, name, accessPin }) {
        const shortId = encryptationServices.createShortId();
        let encrypted
        if (accessPin) encrypted = encryptationServices.encrypt(accessPin);
        await courseRepositories.create({ organizationId: user.organizationId, name, shortId, accessPin: encrypted?.encryptedData, iv: encrypted?.iv });
    },
    editOne: async function ({ id, name, accessPin, user }) {
        await db.sequelize.transaction(async (t) => {
            let encrypted
            if (accessPin) encrypted = encryptationServices.encrypt(accessPin);
            const course = await validTargetCourse({ user, id }, t)
            await courseRepositories.editEntity(course, { name, accessPin: encrypted?.encryptedData, iv: encrypted?.iv }, t)
        })
    },
    getAll: async function ({ user }) {
        const courses = await courseRepositories.getAllByOrganization(user.organizationId)
        return courses
    },
    deleteOne: async function ({ id, user }) {
        await db.sequelize.transaction(async (t) => {
            await validTargetCourse({ user, id }, t)
            await courseRepositories.deleteOneById(id, t)
        })
    }

}

module.exports = courseServices;