const ERRORS = require("../constants/errors");
const db = require("../models");
const coursesRepositories = require("../repositories/courses");
const { COURSE_VARIANTS } = require("../repositories/variants/courses");
const encryptationServices = require("./encryptation");
const { validTargetCourse, validTargetCourses, validTargetStudents } = require("./targetEntities");
const studentRepositories = require("../repositories/student");
const _ = require("lodash");

//TODO Continue here
const coursesServices = {
    create: async function ({ user, name, accessPin, students = [], studentAttendanceFormData = [] }) {
        await db.sequelize.transaction(async (t) => {
            const shortId = encryptationServices.createShortId();
            let encrypted
            if (accessPin) encrypted = encryptationServices.encrypt(accessPin);
            const newCourse = await coursesRepositories.create({
                organizationId: user.organizationId,
                name,
                shortId,
                accessPin: encrypted?.encryptedData ?? null,
                iv: encrypted?.iv ?? null,
                studentAttendanceFormData
            }, t);

            const existentStudents = students.filter(student => !student.isNew && student._id)
            if (!_.isEmpty(existentStudents)) {
                await validTargetStudents({ organizationId: user.organizationId, ids: existentStudents.map(student => student._id) }, t)
                await newCourse.setStudents(existentStudents.map(student => student._id), { transaction: t })
            }
            const studentsToCreate = students.filter(student => student.isNew)
            if (!_.isEmpty(studentsToCreate)) {
                await studentRepositories.bulkCreate(studentsToCreate.map(student => ({ ...student.studentData, organizationId: user.organizationId, courseId: newCourse._id })), t)
            }
        })
    },
    editOne: async function ({ _id, name, accessPin, user, students = [], studentAttendanceFormData = [] }) {
        await db.sequelize.transaction(async (t) => {
            let encrypted
            if (accessPin) encrypted = encryptationServices.encrypt(accessPin);
            const course = await validTargetCourse({ organizationId: user.organizationId, _id }, t)
            await coursesRepositories.editEntity(course, {
                name,
                accessPin: encrypted?.encryptedData ?? null,
                iv: encrypted?.iv ?? null,
                studentAttendanceFormData
            }, t)

            const existentStudents = students.filter(student => !student.isNew && student._id)
            if (!_.isEmpty(existentStudents)) {
                await validTargetStudents({ organizationId: user.organizationId, ids: existentStudents.map(student => student._id) }, t)
                await course.setStudents(existentStudents.map(student => student._id), { transaction: t })
            }
            const studentsToCreate = students.filter(student => student.isNew)
            if (!_.isEmpty(studentsToCreate)) {
                await studentRepositories.bulkCreate(studentsToCreate.map(student => ({ ...student.studentData, organizationId: user.organizationId, courseId: course._id })), t)
            }
        })
    },
    getAll: async function ({ user }) {
        const courses = await coursesRepositories.getAllByOrganization(user.organizationId)
        return courses
    },
    deleteOne: async function ({ _id, user }) {
        await db.sequelize.transaction(async (t) => {
            await validTargetCourse({ organizationId: user.organizationId, _id }, t)
            await studentRepositories.updateByCourseId(_id, { courseId: null }, t)
            await coursesRepositories.deleteById(_id, t)
        })
    },
    deleteMultiple: async function ({ ids, user }) {
        await db.sequelize.transaction(async (t) => {
            await validTargetCourses({ organizationId: user.organizationId, ids }, t)
            await studentRepositories.updateByCourseId(ids, { courseId: null }, t)
            await coursesRepositories.deleteById(ids, t)
        })
    },
    getOne: async function ({ _id, organizationId }) {
        const course = await coursesRepositories.getByIdAndOrganizationId({ _id, organizationId }, COURSE_VARIANTS.FULL);
        if (!course) throw ERRORS.E404_2;
        const result = course.toJSON();
        if (result.accessPin && result.iv) {
            result.accessPin = encryptationServices.decrypt({ encryptedData: result.accessPin, iv: result.iv });
        }
        delete result.iv;
        return result;
    },
    editMultiple: async function ({ ids, studentAttendanceFormData, user }) {
        await db.sequelize.transaction(async (t) => {
            await validTargetCourses({ organizationId: user.organizationId, ids }, t)
            await coursesRepositories.updateById(ids, {
                studentAttendanceFormData
            }, t)
        })
    }
}

module.exports = coursesServices;