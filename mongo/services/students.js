
const { validTargetStudent, validTargetCourse } = require("./targetEntities");
const Student = require("../models/Student");
const Course = require("../models/course");
const ClassSessionStudent = require("../models/classSessionStudent");
const ERRORS = require("../../constants/errors");

const studentsServices = {
    create: async function ({ organizationId, firstName, lastName, courseId }) {
        if (courseId) await validTargetCourse({ organizationId, _id: courseId })
        const student = await Student.create({ organization: organizationId, firstName, lastName, course: courseId });
        await Course.updateOne({ _id: courseId }, { $push: { students: student._id } })
    },
    editOne: async function ({ _id, firstName, lastName, courseId, user }) {
        const organizationId = user.organization._id
        await validTargetStudent({ organizationId, _id })
        if (courseId) await validTargetCourse({ organizationId, _id: courseId })
        const student = await Student.updateOne({ _id }, { firstName, lastName, course: courseId ?? null })
        await Course.updateOne({ _id: student.course }, { $pull: { students: _id } })
        await Course.updateOne({ _id: courseId }, { $push: { students: _id } })
    },
    getAll: async function ({ user, withCourse, courseId }) {
        const students = await Student.find({
            organization: user.organization._id,
            course: {
                $exists: withCourse,
                ...(withCourse && { $eq: courseId })
            }
        })
        return students
    },
    deleteOne: async function ({ _id, user }) {
        const student = await validTargetStudent({ organizationId: user.organization._id, _id })
        await Student.deleteOne({ _id })
        await ClassSessionStudent.deleteMany({ student: _id })
        await Course.updateOne({ _id: student.course._id }, { $pull: { students: _id } })
    },
    getByCourse: async function ({ courseId, organizationId }) {
        const students = await Student.find({ organization: organizationId, course: courseId })
        return students
    },
    getOne: async function ({ _id, user }) {
        const student = await Student.findOne({ organization: user.organization._id, _id }).populate({ path: 'course', select: '_id name' }).populate({ path: 'classSessionsStudent', select: '_id name' })
        if (!student) throw ERRORS.E404_3;
        return student
    }
}

module.exports = studentsServices;