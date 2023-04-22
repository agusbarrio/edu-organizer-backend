const db = require("../models");
const courseRepositories = require("../repositories/course");
const encryptationServices = require("./encryptation");
const { validTargetCourse } = require("./targetEntities");

const courseServices = {
    create: async function ({ user, name }) {
        const shortId = encryptationServices.createShortId()
        await courseRepositories.create({ organizationId: user.organizationId, name, shortId });
    },
    editOne: async function ({ id, name, user }) {
        await db.sequelize.transaction(async (t) => {
            const course = await validTargetCourse({ user, id }, t)
            await courseRepositories.editEntity(course, { name }, t)
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