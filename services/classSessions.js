const ERRORS = require("../constants/errors");
const db = require("../models");
const classSessionsRepositories = require("../repositories/classSessions");

const { validTargetStudents } = require("./targetEntities");

const classSessionsServices = {
    newCourseClass: async ({ course, presentStudentsData = [] }) => {
        await db.sequelize.transaction(async (t) => {
            const { id: courseId, organizationId } = course
            const students = await validTargetStudents({ organizationId, ids: presentStudentsData }, t)
            students.forEach(student => {
                if (student.courseId !== courseId) throw ERRORS.E403_1;
            })
            const classSession = await classSessionsRepositories.create({ courseId, organizationId, date: new Date() }, t)
            await classSession.setStudents(presentStudentsData, { transaction: t })
        })
    }
}

module.exports = classSessionsServices
