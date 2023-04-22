const ERRORS = require("../constants/errors");
const courseRepositories = require("../repositories/course");
const studentRepositories = require("../repositories/student");

const targetEntitieServices = {
    validTargetCourse: async function ({ user, id }, transaction) {
        const { organizationId } = user;
        const course = await courseRepositories.getOneById(id, transaction);
        if (!course) throw ERRORS.E404_2;
        if (course.organizationId !== organizationId) throw ERRORS.E403_1;
        return course;
    },
    validTargetStudent: async function ({ user, id }, transaction) {
        const { organizationId } = user;
        const student = await studentRepositories.getOneById(id, transaction);
        if (!student) throw ERRORS.E404_3;
        if (student.organizationId !== organizationId) throw ERRORS.E403_1;
        return student;
    }
}

module.exports = targetEntitieServices