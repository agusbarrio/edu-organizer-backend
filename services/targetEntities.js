const ERRORS = require("../constants/errors");
const classSessionsRepositories = require("../repositories/classSessions");
const coursesRepositories = require("../repositories/courses");
const filesRepositories = require("../repositories/files");
const studentRepositories = require("../repositories/student");

const targetEntitieServices = {
    validTargetCourse: async function ({ organizationId, id }, transaction) {
        const course = await coursesRepositories.getByIdAndOrganizationId({ id, organizationId }, null, transaction);
        if (!course) throw ERRORS.E404_2;
        return course;
    },
    validTargetStudent: async function ({ organizationId, id }, transaction) {
        const student = await studentRepositories.getByIdAndOrganizationId({ id, organizationId }, null, transaction);
        if (!student) throw ERRORS.E404_3;
        return student;
    },
    validTargetClassSession: async function ({ organizationId, id }, transaction) {
        const classSession = await classSessionsRepositories.getByIdAndOrganizationId({ id, organizationId }, null, transaction);
        if (!classSession) throw ERRORS.E404_4;
        return classSession;
    },
    validTargetStudents: async function ({ organizationId, ids }, transaction) {
        const students = await studentRepositories.getAllByIds(ids, transaction);
        if (students.length !== ids.length) throw ERRORS.E404_3;
        students.forEach(student => {
            if (student.organizationId !== organizationId) throw ERRORS.E403_1;
        }
        );
        return students;
    },
    validTargetCourses: async function ({ organizationId, ids }, transaction) {
        const courses = await coursesRepositories.getAllByIds(ids, transaction);
        if (courses.length !== ids.length) throw ERRORS.E404_2;
        courses.forEach(course => {
            if (course.organizationId !== organizationId) throw ERRORS.E403_1;
        }
        );
        return courses;
    },
    validTargetCourseStudents: async function ({ courseId, studentsIds }, transaction) {
        const students = await studentRepositories.getAllByIds(studentsIds, transaction);
        if (students.length !== studentsIds.length) throw ERRORS.E404_3;
        students.forEach(student => {
            if (student.courseId !== courseId) throw ERRORS.E403_1;
        });
        return students;
    },
    validTargetCourseClassSession: async function ({ courseId, id }, transaction) {
        const classSession = await classSessionsRepositories.getByIdAndCourseId({ id, courseId }, transaction);
        if (!classSession) throw ERRORS.E404_4;
        return classSession;
    },
    validTargetFile: async function ({ organizationId, id }, transaction) {
        const file = await filesRepositories.getByIdAndOrganizationId({ id, organizationId }, transaction);
        if (!file) throw ERRORS.E404_5;
        return file;
    },
    validTargetFiles: async function ({ organizationId, ids }, transaction) {
        const files = await filesRepositories.getAllByIds(ids, transaction);
        if (files.length !== ids.length) throw ERRORS.E404_5;
        files.forEach(file => {
            if (file.organizationId !== organizationId) throw ERRORS.E403_1;
        }
        );
        return files;
    }
}

module.exports = targetEntitieServices