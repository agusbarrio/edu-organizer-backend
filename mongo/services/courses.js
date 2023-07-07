const ERRORS = require("../../constants/errors");
const encryptationServices = require("./encryptation");
const { validTargetCourse, validTargetCourses, validTargetStudents } = require("./targetEntities");
const _ = require("lodash");
const Student = require("../models/Student");
const Course = require("../models/course");

//TODO Continue here
const coursesServices = {
    create: async function ({ user, name, accessPin, students = [], studentAttendanceFormData = [] }) {
        let encrypted
        if (accessPin) encrypted = encryptationServices.encrypt(accessPin);
        let studentsToSet = []
        const existentStudents = students.filter(student => !student.isNew && student._id)
        if (!_.isEmpty(existentStudents)) {
            await validTargetStudents({ organizationId: user.organization._id, ids: existentStudents.map(student => student._id) })
            studentsToSet = existentStudents.map(student => student._id)
        }
        const studentsToCreate = students.filter(student => student.isNew)
        if (!_.isEmpty(studentsToCreate)) {
            const createdStudents = Student.insertMany(studentsToCreate.map(student => ({ ...student.studentData, organization: user.organization._id })))
            studentsToSet = [...studentsToSet, ...createdStudents.map(student => student._id)]
        }
        const newCourse = await Course.create({
            organization: user.organization._id,
            name,
            accessPin: encrypted?.encryptedData ?? null,
            iv: encrypted?.iv ?? null,
            studentAttendanceFormData,
            students: studentsToSet
        });
        await Student.updateMany({ _id: { $in: studentsToSet } }, { course: newCourse._id })
    },
    editOne: async function ({ _id, name, accessPin, user, students = [], studentAttendanceFormData = [] }) {

        let encrypted
        if (accessPin) encrypted = encryptationServices.encrypt(accessPin);
        const course = await validTargetCourse({ organizationId: user.organization._id, _id })
        let studentsToSet = []

        const existentStudents = students.filter(student => !student.isNew && student._id)
        if (!_.isEmpty(existentStudents)) {
            await validTargetStudents({ organizationId: user.organization._id, ids: existentStudents.map(student => student._id) })
            studentsToSet = existentStudents.map(student => student._id)
        }
        const studentsToCreate = students.filter(student => student.isNew)
        if (!_.isEmpty(studentsToCreate)) {
            const createdStudents = Student.insertMany(studentsToCreate.map(student => ({ ...student.studentData, organization: user.organization._id })))
            studentsToSet = [...studentsToSet, ...createdStudents.map(student => student._id)]
        }
        await Course.updateOne({ _id: course._id }, {
            name,
            accessPin: encrypted?.encryptedData ?? null,
            iv: encrypted?.iv ?? null,
            studentAttendanceFormData,
            students: studentsToSet
        })
        await Student.updateMany({ _id: { $in: studentsToSet } }, { course: course._id })
    },
    getAll: async function ({ user }) {
        const courses = await Course.find({ organization: user.organization._id })
        return courses
    },
    deleteOne: async function ({ _id, user }) {
        await validTargetCourse({ organizationId: user.organization._id, _id })
        await Student.updateMany({ course: _id }, { course: null })
        await Course.deleteOne({ _id })
    },
    deleteMultiple: async function ({ ids, user }) {
        await validTargetCourses({ organizationId: user.organization._id, ids })
        await Student.updateMany({ course: { $in: ids } }, { course: null })
        await Course.deleteMany({ _id: { $in: ids } })
    },
    getOne: async function ({ _id, organizationId }) {
        const course = Course.find({ _id, organization: organizationId }).populate('students').populate('organization')
        if (!course) throw ERRORS.E404_2;
        const result = course.toJSON();
        if (result.accessPin && result.iv) {
            result.accessPin = encryptationServices.decrypt({ encryptedData: result.accessPin, iv: result.iv });
        }
        delete result.iv;
        return result;
    },
    editMultiple: async function ({ ids, studentAttendanceFormData, user }) {
        await validTargetCourses({ organizationId: user.organization._id, ids })
        await Course.updateMany({ _id: { $in: ids } }, { studentAttendanceFormData })
    }
}

module.exports = coursesServices;