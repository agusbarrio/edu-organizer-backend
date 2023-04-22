const ERRORS = require("../constants/errors");
const db = require("../models");
const courseRepositories = require("../repositories/course");
const encryptationServices = require("./encryptation");

const courseServices = {
    validTargetCourse: async function ({ user, id }, transaction) {
        const { organizationId } = user;
        const course = await courseRepositories.getOneById(id, transaction);
        if (!course) throw ERRORS.E404_2;
        if (course.organizationId !== organizationId) throw ERRORS.E403_1;
        return course;
    },
    create: async function ({ user, name }) {
        const shortId = encryptationServices.createShortId()
        await courseRepositories.create({ organizationId: user.organizationId, name, shortId });
    },
    editOne: async function ({ id, name, user }) {
        await db.sequelize.transaction(async (t) => {
            const course = await this.validTargetCourse({ user, id }, t)
            await courseRepositories.editEntity(course, { name }, t)
        })
    },
    getAll: async function ({ user }) {
        const courses = await courseRepositories.getAllByOrganization(user.organizationId)
        return courses
    },
    deleteOne: async function ({ id, user }) {
        await db.sequelize.transaction(async (t) => {
            await this.validTargetCourse({ user, id }, t)
            await courseRepositories.deleteOneById(id, t)
        })
    }

}

module.exports = courseServices;