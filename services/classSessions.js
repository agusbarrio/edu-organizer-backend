const db = require("../models");
const classSessionsRepositories = require("../repositories/classSessions");
const studentRepositories = require("../repositories/student");

const { validTargetStudents } = require("./targetEntities");

const classSessionsServices = {
    startClassSession: async ({ course, presentStudentsIds = [], newStudents = [] }) => {
        await db.sequelize.transaction(async (t) => {
            const { id: courseId, organizationId } = course
            //TODO validar que los estudiantes sean tambien del curso
            const existentPresentStudents = await validTargetStudents({ organizationId, ids: presentStudentsIds }, t)
            const studentsToCreate = newStudents.map(student => {
                return {
                    ...student,
                    organizationId,
                    courseId
                }
            })
            const newStudentsCreated = await studentRepositories.bulkCreate(studentsToCreate, t)
            const newStudentsCreatedPresent = newStudentsCreated.filter(student => student.present)
            const presentStudentsIdsResult = [...newStudentsCreatedPresent, ...existentPresentStudents].map(student => student.id)
            const classSession = await classSessionsRepositories.create({ courseId, organizationId, date: new Date() }, t)
            await classSession.setStudents(presentStudentsIdsResult, { transaction: t })
        })
    }
}

module.exports = classSessionsServices
