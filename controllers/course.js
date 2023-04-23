const coursesServices = require("../services/courses");
const studentsServices = require("../services/students");
const classSessionsServices = require("../services/classSessions");
const validator = require('../services/validator')
const courseControllers = {
    //req.course disponible
    get: async (req, res, next) => {
        try {
            const { id } = req.course
            const course = await coursesServices.getOne({ id })
            res.json(course)
        } catch (error) {
            next(error)
        }
    },
    getStudents: async (req, res, next) => {
        try {
            const { id, organizationId } = req.course
            const students = await studentsServices.getByCourse({ courseId: id, organizationId })
            res.json(students)
        } catch (error) {
            next(error)
        }
    },
    startClassSession: async (req, res, next) => {
        try {
            const schema = validator.createSchema({
                presentStudentsIds: validator.ids({ required: { value: true } }),
            })
            const { presentStudentsIds, newStudents } = await validator.validate(schema, req.body)
            await classSessionsServices.startClassSession({ course: req.course, presentStudentsIds, newStudents })
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
            const { id: courseId, organizationId } = req.course

            await studentsServices.create({ organizationId, courseId, firstName, lastName })
            res.send('Student created into current course')
        } catch (error) {
            next(error)
        }
    }
}

module.exports = courseControllers;
