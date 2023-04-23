const ERRORS = require("../constants/errors");
const coursesRepositories = require("../repositories/courses");
const studentRepositories = require("../repositories/student");

const targetEntitieServices = {
    validTargetCourse: async function ({ organizationId, id }, transaction) {
        const course = await coursesRepositories.getOneById(id, transaction);
        if (!course) throw ERRORS.E404_2;
        if (course.organizationId !== organizationId) throw ERRORS.E403_1;
        return course;
    },
    validTargetStudent: async function ({ organizationId, id }, transaction) {
        const student = await studentRepositories.getOneById(id, transaction);
        if (!student) throw ERRORS.E404_3;
        if (student.organizationId !== organizationId) throw ERRORS.E403_1;
        return student;
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
}

module.exports = targetEntitieServices