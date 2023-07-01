const db = require("../models");
const classSessionsRepositories = require("../repositories/classSessions");
const studentRepositories = require("../repositories/student");
const _ = require("lodash");
const { validTargetCourseStudents, validTargetClassSession } = require("./targetEntities");
const classSessionStudentsRepositories = require("../repositories/classSessionStudents");
const { CLASS_SESSION_VARIANTS } = require("../repositories/variants/classSession");
const ERRORS = require("../constants/errors");
const validator = require('../services/validator');
const coursesRepositories = require("../repositories/courses");
const { COURSE_VARIANTS } = require("../repositories/variants/courses");
const moment = require('moment')

const classSessionsServices = {
    newCourseClass: async ({ course, presentStudentsData = [], date = moment() }) => {
        await db.sequelize.transaction(async (t) => {
            const { id: courseId, organizationId } = course
            await validTargetCourseStudents({ courseId, studentsIds: presentStudentsData.map(student => student.id) }, t)
            const classSession = await classSessionsRepositories.create({ courseId, organizationId, date }, t)
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
    },
    getAll: async ({ user }) => {
        const organizationId = user.organizationId
        const classSessions = await classSessionsRepositories.getAllByOrganization(organizationId, CLASS_SESSION_VARIANTS.LIST)
        return classSessions
    },
    getOne: async ({ id, organizationId }) => {
        const classSession = await classSessionsRepositories.getByIdAndOrganizationId({ id, organizationId }, CLASS_SESSION_VARIANTS.FULL);
        if (!classSession) throw ERRORS.E404_4;
        return classSession
    },
    deleteOne: async function ({ id, user }) {
        await db.sequelize.transaction(async (t) => {
            await validTargetClassSession({ organizationId: user.organizationId, id }, t)
            await classSessionsRepositories.deleteById(id, t)
        })
    },
    editOne: async function ({ id, user, date, presentStudentsData: presentStudentsDataParam }) {
        await db.sequelize.transaction(async (t) => {
            const classSession = await validTargetClassSession({ organizationId: user.organizationId, id })
            const course = await coursesRepositories.getOneById(classSession.courseId, COURSE_VARIANTS.FULL, t)
            const schema = validator.createSchema({
                presentStudentsData: validator.array({ required: { value: true } }).of(
                    validator.object({ required: { value: true } },
                        {
                            id: validator.id(),
                            ...validator.getStudentAttendanceSchema(course.studentAttendanceFormData)
                        }))
            })
            const { presentStudentsData } = await validator.validate(schema, { presentStudentsData: presentStudentsDataParam })
            await validTargetCourseStudents({ courseId: course.id, studentsIds: presentStudentsData.map(student => student.id) }, t)
            await classSessionsRepositories.editEntity(classSession, { date: moment(date) }, t)
            await classSessionStudentsRepositories.deleteByClassSessionId(classSession.id, t)
            const courseStudents = course?.students ?? []
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
    },
}

module.exports = classSessionsServices
