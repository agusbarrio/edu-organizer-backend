const coursesServices = require("../services/courses");
const studentsServices = require("../services/students");
const classSessionsServices = require("../services/classSessions");
const validator = require('../services/validator');
const moment = require("moment");
const courseControllers = {
    //req.course disponible
    get: async (req, res, next) => {
        try {
            const { _id, organization } = req.course
            const course = await coursesServices.getOne({ _id, organizationId: organization._id })
            res.json(course)
        } catch (error) {
            next(error)
        }
    },
    getStudents: async (req, res, next) => {
        try {
            const { _id, organization } = req.course
            const students = await studentsServices.getByCourse({ courseId: _id, organizationId: organization._id })
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
                            _id: validator._id(),
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
            })
            const { firstName, lastName } = await validator.validate(schema, req.body)
            const { _id: courseId, organization } = req.course

            await studentsServices.create({ organizationId: organization._id, courseId, firstName, lastName })
            res.send('Student created into current course')
        } catch (error) {
            next(error)
        }
    }
}

module.exports = courseControllers;
