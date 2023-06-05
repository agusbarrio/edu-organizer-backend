const db = require("../models");
const classSessionsRepositories = require("../repositories/classSessions");
const studentRepositories = require("../repositories/student");
const _ = require("lodash");
const { validTargetCourseStudents } = require("./targetEntities");
const classSessionStudentsRepositories = require("../repositories/classSessionStudents");

const classSessionsServices = {
    newCourseClass: async ({ course, presentStudentsData = [] }) => {
        await db.sequelize.transaction(async (t) => {
            const { id: courseId, organizationId } = course
            await validTargetCourseStudents({ courseId, studentsIds: presentStudentsData.map(student => student.id) }, t)
            const classSession = await classSessionsRepositories.create({ courseId, organizationId, date: new Date() }, t)
            const courseStudents = await studentRepositories.getAllByCourseId(courseId, t)
            if (!_.isEmpty(courseStudents)) {
                const classSessionStudentsToCreate = courseStudents.map(student => ({
                    classSessionId: classSession.id,
                    studentId: student.id,
                    isPresent: presentStudentsData.some(presentStudent => presentStudent.id === student.id),
                    metadata: presentStudentsData.find(presentStudent => presentStudent.id === student.id)?.metadata ?? null
                }))
                await classSessionStudentsRepositories.bulkCreate(classSessionStudentsToCreate, t)
            }
        })
    }
}

module.exports = classSessionsServices
