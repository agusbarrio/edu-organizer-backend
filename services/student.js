const db = require("../models");
const studentRepositories = require("../repositories/student");
const { validTargetStudent, validTargetCourse } = require("./targetEntities");

const studentServices = {
    create: async function ({ user, firstName, lastName, courseId }) {
        await db.sequelize.transaction(async (t) => {
            if (courseId) await validTargetCourse({ user, id: courseId }, t)
            await studentRepositories.create({ organizationId: user.organizationId, firstName, lastName, courseId }, t);
        })
    },
    editOne: async function ({ id, firstName, lastName, courseId, user }) {
        await db.sequelize.transaction(async (t) => {
            if (courseId) await validTargetCourse({ user, id: courseId }, t)
            const student = await validTargetStudent({ user, id }, t)
            await studentRepositories.editEntity(student, { firstName, lastName, courseId }, t)
        })
    },
    getAll: async function ({ user }) {
        const students = await studentRepositories.getAllByOrganization(user.organizationId)
        return students
    },
    deleteOne: async function ({ id, user }) {
        await db.sequelize.transaction(async (t) => {
            await validTargetStudent({ user, id }, t)
            await studentRepositories.deleteOneById(id, t)
        })
    }

}

module.exports = studentServices;