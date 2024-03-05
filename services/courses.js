const ERRORS = require("../constants/errors");
const db = require("../models");
const coursesRepositories = require("../repositories/courses");
const { COURSE_VARIANTS } = require("../repositories/variants/courses");
const encryptationServices = require("./encryptation");
const { validTargetCourse, validTargetCourses, validTargetStudents, validTargetFiles } = require("./targetEntities");
const studentRepositories = require("../repositories/student");
const _ = require("lodash");
const filesRepositories = require("../repositories/files");

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

            const existentStudents = students.filter(student => !student.isNew && student.id)
            if (!_.isEmpty(existentStudents)) {
                await validTargetStudents({ organizationId: user.organizationId, ids: existentStudents.map(student => student.id) }, t)
                await newCourse.setStudents(existentStudents.map(student => student.id), { transaction: t })
            }
            const studentsToCreate = students.filter(student => student.isNew)
            if (!_.isEmpty(studentsToCreate)) {
                const files = await validTargetFiles({ organizationId: user.organizationId, ids: studentsToCreate.map(student => student.studentData.avatarFileId).filter(id => id) }, t)
                await filesRepositories.updateById(files.map(file => file.id), { inUse: true }, t)
                await studentRepositories.bulkCreate(studentsToCreate.map(student => ({ ...student.studentData, organizationId: user.organizationId, courseId: newCourse.id })), t)
            }
        })
    },
    editOne: async function ({ id, name, accessPin, user, students = [], studentAttendanceFormData = [] }) {
        await db.sequelize.transaction(async (t) => {
            let encrypted
            if (accessPin) encrypted = encryptationServices.encrypt(accessPin);
            const course = await validTargetCourse({ organizationId: user.organizationId, id }, t)
            await coursesRepositories.editEntity(course, {
                name,
                accessPin: encrypted?.encryptedData ?? null,
                iv: encrypted?.iv ?? null,
                studentAttendanceFormData
            }, t)

            const existentStudents = students.filter(student => !student.isNew && student.id)
            if (!_.isEmpty(existentStudents)) {
                await validTargetStudents({ organizationId: user.organizationId, ids: existentStudents.map(student => student.id) }, t)
                await course.setStudents(existentStudents.map(student => student.id), { transaction: t })
            }
            const studentsToCreate = students.filter(student => student.isNew)
            if (!_.isEmpty(studentsToCreate)) {
                const files = await validTargetFiles({ organizationId: user.organizationId, ids: studentsToCreate.map(student => student.studentData.avatarFileId).filter(id => id) }, t)
                await filesRepositories.updateById(files.map(file => file.id), { inUse: true }, t)
                await studentRepositories.bulkCreate(studentsToCreate.map(student => ({ ...student.studentData, organizationId: user.organizationId, courseId: course.id })), t)
            }
        })
    },
    getAll: async function ({ user }) {
        const courses = await coursesRepositories.getAllByOrganization(user.organizationId)
        return courses
    },
    deleteOne: async function ({ id, user }) {
        await db.sequelize.transaction(async (t) => {
            await validTargetCourse({ organizationId: user.organizationId, id }, t)
            await studentRepositories.updateByCourseId(id, { courseId: null }, t)
            await coursesRepositories.deleteById(id, t)
        })
    },
    deleteMultiple: async function ({ ids, user }) {
        await db.sequelize.transaction(async (t) => {
            await validTargetCourses({ organizationId: user.organizationId, ids }, t)
            await studentRepositories.updateByCourseId(ids, { courseId: null }, t)
            await coursesRepositories.deleteById(ids, t)
        })
    },
    getOne: async function ({ id, organizationId }) {
        const course = await coursesRepositories.getByIdAndOrganizationId({ id, organizationId }, COURSE_VARIANTS.FULL);
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