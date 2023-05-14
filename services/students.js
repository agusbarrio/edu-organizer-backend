const ERRORS = require("../constants/errors");
const db = require("../models");
const studentRepositories = require("../repositories/student");
const { validTargetStudent, validTargetCourse } = require("./targetEntities");

const studentsServices = {
    create: async function ({ organizationId, firstName, lastName, courseId }) {
        await db.sequelize.transaction(async (t) => {
            if (courseId) await validTargetCourse({ organizationId, id: courseId }, t)
            await studentRepositories.create({ organizationId, firstName, lastName, courseId }, t);
        })
    },
    editOne: async function ({ id, firstName, lastName, courseId, user }) {
        await db.sequelize.transaction(async (t) => {
            const organizationId = user.organizationId
            if (courseId) await validTargetCourse({ organizationId, id: courseId }, t)
            const student = await validTargetStudent({ organizationId, id }, t)
            await studentRepositories.editEntity(student, { firstName, lastName, courseId }, t)
        })
    },
    getAll: async function ({ user }) {
        const students = await studentRepositories.getAllByOrganization(user.organizationId)
        return students
    },
    deleteOne: async function ({ id, user }) {
        await db.sequelize.transaction(async (t) => {
            await validTargetStudent({ organizationId: user.organizationId, id }, t)
            await studentRepositories.deleteOneById(id, t)
        })
    },
    getByCourse: async function ({ courseId }) {
        const students = await studentRepositories.getAllByCourseId({ courseId })
        return students
    },
    getOne: async function ({ id }) {
        const course = await studentRepositories.getOneById(id);
        if (!course) throw ERRORS.E404_3;
        return course
    }
}

module.exports = studentsServices;