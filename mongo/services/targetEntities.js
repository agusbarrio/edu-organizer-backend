
const ERRORS = require("../../constants/errors");
const Course = require("../models/course");
const Student = require("../models/Student");
const ClassSession = require("../models/classSession");
const ClassSessionStudent = require("../models/classSessionStudent");

const targetEntitieServices = {
    validTargetCourse: async function ({ organizationId, _id }) {
        const course = await Course.exists({ organization: organizationId, _id });
        if (!course) throw ERRORS.E404_2;
        return course;
    },
    validTargetStudent: async function ({ organizationId, _id }) {
        const student = await Student.exists({ organization: organizationId, _id });
        if (!student) throw ERRORS.E404_3;
        return student;
    },
    validTargetClassSession: async function ({ organizationId, _id }) {
        const classSession = await ClassSession.find({ organization: organizationId, _id }).populate({ path: 'course', select: '_id name' });
        if (!classSession) throw ERRORS.E404_4;
        return classSession;
    },
    validTargetStudents: async function ({ organizationId, ids }) {
        const students = await Student.find({ _id: { $in: ids }, organization: organizationId });
        if (students.length !== ids.length) throw ERRORS.E404_3;
        return students;
    },
    validTargetCourses: async function ({ organizationId, ids }) {
        const courses = await Course.find({ _id: { $in: ids }, organization: organizationId });
        if (courses.length !== ids.length) throw ERRORS.E404_2;
        return courses;
    },
    validTargetCourseStudents: async function ({ courseId, studentsIds }) {
        const students = await Student.find({ _id: { $in: studentsIds }, course: courseId });
        if (students.length !== studentsIds.length) throw ERRORS.E404_3;
        return students;
    }
}

module.exports = targetEntitieServices