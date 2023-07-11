const _ = require("lodash");
const { validTargetCourseStudents, validTargetClassSession } = require("./targetEntities");
const ERRORS = require("../../constants/errors");
const validator = require('../services/validator');
const moment = require('moment');
const ClassSession = require("../models/classSession");
const Student = require("../models/Student");
const ClassSessionStudent = require("../models/classSessionStudent");
const Course = require("../models/course");


const classSessionsServices = {
    newCourseClass: async ({ course, presentStudentsData: presentStudentsDataParam = [], date = moment() }) => {
        const courseId = course._id
        const organizationId = course.organization._id

        await validTargetCourseStudents({ courseId, studentsIds: presentStudentsDataParam.map(student => student._id) })

        const fullCourse = await Course.findOne({ _id: courseId })
        const schema = validator.createSchema({
            presentStudentsData: validator.array({ required: { value: true } }).of(
                validator.object({ required: { value: true } },
                    {
                        _id: validator._id(),
                        ...validator.getStudentAttendanceSchema(fullCourse.studentAttendanceFormData)
                    }))
        })
        const { presentStudentsData } = await validator.validate(schema, { presentStudentsData: presentStudentsDataParam })
        const classSession = await ClassSession.create({ course: courseId, organization: organizationId, date })
        const courseStudents = await Student.find({ course: courseId })
        if (!_.isEmpty(courseStudents)) {
            const classSessionStudentsToCreate = courseStudents.map(student => ({
                classSession: classSession._id,
                student: student._id,
                isPresent: presentStudentsData.some(presentStudent => presentStudent._id === student._id),
                metadata: presentStudentsData.find(presentStudent => presentStudent._id === student._id)?.metadata ?? null,
                organization: organizationId
            }))
            const newClassSessionStudents = await ClassSessionStudent.insertMany(classSessionStudentsToCreate)
            await ClassSession.updateOne({ _id: classSession._id }, { classSessionStudents: newClassSessionStudents.map(newClassSessionStudent => newClassSessionStudent._id) })
        }
        await Course.updateOne({ _id: courseId }, { $push: { classSessions: classSession._id } })

    },
    getAll: async ({ user }) => {
        const organizationId = user.organization._id
        const classSessions = await ClassSession.find({ organization: organizationId }).select('_id date').populate({ path: 'course', select: '_id name' })
        return classSessions
    },
    getOne: async ({ _id, organizationId }) => {
        const classSession = await ClassSession
            .findOne({ organization: organizationId, _id })
            .populate({ path: 'course', select: '_id name studentAttendanceFormData' })
            .populate({
                path: 'classSessionStudents',
                populate: { path: 'student', select: '_id firstName lastName' }
            })
        if (!classSession) throw ERRORS.E404_4;
        return classSession
    },
    deleteOne: async function ({ _id, user }) {
        await validTargetClassSession({ organization: user.organization._id, _id })
        await ClassSession.deleteOne({ _id })
        //delete from course, delete classSessionsStudents with this classSession
        await Course.updateOne({ classSessions: _id }, { $pull: { classSessions: _id } })
        await ClassSessionStudent.deleteMany({ classSession: _id })
    },
    editOne: async function ({ _id, user, date, presentStudentsData: presentStudentsDataParam }) {
        const classSession = await validTargetClassSession({ organizationId: user.organization._id, _id })
        const course = await Course.findOne({ _id: classSession.course._id }).populate('students').populate('organization')
        const schema = validator.createSchema({
            presentStudentsData: validator.array({ required: { value: true } }).of(
                validator.object({ required: { value: true } },
                    {
                        _id: validator._id(),
                        ...validator.getStudentAttendanceSchema(course.studentAttendanceFormData)
                    }))
        })
        const { presentStudentsData } = await validator.validate(schema, { presentStudentsData: presentStudentsDataParam })
        await validTargetCourseStudents({ courseId: course._id, studentsIds: presentStudentsData.map(student => student._id) })
        await ClassSession.updateOne({ _id: classSession._id }, { date: moment(date) })
        await ClassSessionStudent.deleteMany({ classSession: classSession._id })
        const courseStudents = course?.students ?? []
        if (!_.isEmpty(courseStudents)) {
            const classSessionStudentsToCreate = courseStudents.map(student => ({
                classSessionId: classSession._id,
                studentId: student._id,
                isPresent: presentStudentsData.some(presentStudent => presentStudent._id === student._id),
                metadata: presentStudentsData.find(presentStudent => presentStudent._id === student._id)?.metadata ?? null,
                organizationId: user.organization._id
            }))
            const classSessionStudents = await ClassSessionStudent.insertMany(classSessionStudentsToCreate)
            await ClassSession.updateOne({ _id: classSession._id }, { classSessionStudents: classSessionStudents.map(classSessionStudent => classSessionStudent._id) })
        }
    },
}

module.exports = classSessionsServices
