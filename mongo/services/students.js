const ERRORS = require("../constants/errors");
const db = require("../models");
const studentRepositories = require("../repositories/student");
const { STUDENT_VARIANTS } = require("../repositories/variants/student");
const { validTargetStudent, validTargetCourse } = require("./targetEntities");
//TODO continuar aqui
const studentsServices = {
    create: async function ({ organizationId, firstName, lastName, courseId }) {
        await db.sequelize.transaction(async (t) => {
            if (courseId) await validTargetCourse({ organizationId, _id: courseId }, t)
            await studentRepositories.create({ organizationId, firstName, lastName, courseId }, t);
        })
    },
    editOne: async function ({ _id, firstName, lastName, courseId, user }) {
        await db.sequelize.transaction(async (t) => {
            const organizationId = user.organizationId
            if (courseId) await validTargetCourse({ organizationId, _id: courseId }, t)
            const student = await validTargetStudent({ organizationId, _id }, t)
            await studentRepositories.editEntity(student, { firstName, lastName, courseId }, t)
        })
    },
    getAll: async function ({ user, withCourse, courseId }) {
        const students = await studentRepositories.getAllByOrganization({ organizationId: user.organizationId, withCourse, courseId })
        return students
    },
    deleteOne: async function ({ _id, user }) {
        await db.sequelize.transaction(async (t) => {
            await validTargetStudent({ organizationId: user.organizationId, _id }, t)
            await studentRepositories.deleteById(_id, t)
        })
    },
    getByCourse: async function ({ courseId }) {
        const students = await studentRepositories.getAllByCourseId(courseId)
        return students
    },
    getOne: async function ({ _id, user }) {
        const student = await studentRepositories.getByIdAndOrganizationId({ _id, organizationId: user.organizationId }, STUDENT_VARIANTS.FULL);
        if (!student) throw ERRORS.E404_3;
        return student
    }
}

module.exports = studentsServices;