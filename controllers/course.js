const coursesServices = require("../services/courses");
const studentsServices = require("../services/students");
const classSessionsServices = require("../services/classSessions");
const validator = require('../services/validator');
const moment = require("moment");
const courseControllers = {
    //req.course disponible
    get: async (req, res, next) => {
        try {
            const { id, organizationId } = req.course
            const course = await coursesServices.getOne({ id, organizationId })
            res.json(course)
        } catch (error) {
            next(error)
        }
    },
    getStudents: async (req, res, next) => {
        try {
            const { id } = req.course
            const students = await studentsServices.getByCourse({ courseId: id })
            res.json(students)
        } catch (error) {
            next(error)
        }
    },
    newClass: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                date: validator.date({ required: { value: true }, max: { value: moment() } }),
                presentStudentsData: validator.array({ required: { value: true } }).of(
                    validator.object({ required: { value: true } },
                        {
                            id: validator.id(),
                            ...validator.getStudentAttendanceSchema(req.course.studentAttendanceFormData)
                        }))
            })
            const { presentStudentsData, date } = await validator.validate(schema, req.body)
            await classSessionsServices.newCourseClass({ course: req.course, presentStudentsData, date })
            res.send('Class session saved')
        } catch (error) {
            next(error)
        }
    },
    createStudent: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                firstName: validator.text({ required: { value: true } }),
                lastName: validator.text({ required: { value: true } }),
                avatarFileId: validator.id({ required: { value: false } }),
                additionalInfo: validator.anyObject()
            })
            const { firstName, lastName, avatarFileId, additionalInfo } = await validator.validate(schema, req.body)
            const { id: courseId, organizationId } = req.course

            await studentsServices.create({ organizationId, courseId, firstName, lastName, avatarFileId, additionalInfo })
            res.send('Student created into current course')
        } catch (error) {
            next(error)
        }
    },
    getClassSessions: async (req, res, next) => {
        try {
            const { id } = req.course
            const classSessions = await classSessionsServices.getByCourse({ courseId: id })
            res.json(classSessions)
        } catch (error) {
            next(error)
        }
    },
    deleteClassSession: async (req, res, next) => {
        try {
            const { id } = req.params
            const { id: courseId } = req.course
            await classSessionsServices.deleteByIdAndCourse({ id, courseId })
            res.send('Class session deleted')
        } catch (error) {
            next(error)
        }
    },
    getClassSession: async (req, res, next) => {
        try {
            const { id } = req.params
            const { id: courseId } = req.course
            const classSession = await classSessionsServices.getByIdAndCourse({ id, courseId })
            res.json(classSession)
        } catch (error) {
            next(error)
        }
    },
    editClassSession: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                id: validator.id(),
                date: validator.date({ required: { value: true }, max: { value: moment() } }),
            })
            const { date, id } = await validator.validate(schema, { ...req.body, id: req.params.id })
            const { id: courseId } = req.course
            await classSessionsServices.editOne({ id, courseId, presentStudentsData: req.body.presentStudentsData, date, })
            res.send('Class session saved')
        } catch (error) {
            next(error)
        }
    },

}

module.exports = courseControllers;
