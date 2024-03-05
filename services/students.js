const ERRORS = require("../constants/errors");
const db = require("../models");
const studentRepositories = require("../repositories/student");
const filesRepositories = require("../repositories/files");
const { STUDENT_VARIANTS } = require("../repositories/variants/student");
const fileUploadServices = require("./files");

const { validTargetStudent, validTargetCourse, validTargetFile } = require("./targetEntities");
const fileSystemServices = require("./fileSystem");

const studentsServices = {
    create: async function ({ organizationId, firstName, lastName, courseId, avatarFileId }) {
        await db.sequelize.transaction(async (t) => {
            if (courseId) await validTargetCourse({ organizationId, id: courseId }, t)
            if (avatarFileId) {
                const file = await validTargetFile({ organizationId, id: avatarFileId }, t)
                filesRepositories.editEntity(file, { inUse: true }, t)
            }
            await studentRepositories.create({ organizationId, firstName, lastName, courseId, avatarFileId }, t);
        })
    },
    editOne: async function ({ id, firstName, lastName, courseId, user, avatarFileId }) {
        await db.sequelize.transaction(async (t) => {
            const organizationId = user.organizationId
            if (courseId) await validTargetCourse({ organizationId, id: courseId }, t)
            const student = await validTargetStudent({ organizationId, id }, t)
            if (avatarFileId) {
                const file = await validTargetFile({ organizationId, id: avatarFileId }, t)
                filesRepositories.editEntity(file, { inUse: true }, t)
            }
            if (student.avatarFileId) {
                const oldFile = await filesRepositories.getOneById(student.avatarFileId, t)
                await fileSystemServices.deleteFile(oldFile.path)
                await filesRepositories.deleteById(student.avatarFileId, t)
            }
            await studentRepositories.editEntity(student, { firstName, lastName, courseId, avatarFileId }, t)
        })

    },
    getAll: async function ({ user, withCourse, courseId }) {
        const students = await studentRepositories.getAllByOrganization({ organizationId: user.organizationId, withCourse, courseId })
        return students
    },
    deleteOne: async function ({ id, user }) {
        await db.sequelize.transaction(async (t) => {
            const student = await validTargetStudent({ organizationId: user.organizationId, id }, t)
            if (student.avatarFileId) {
                const file = await filesRepositories.getOneById(student.avatarFileId, t)
                await fileSystemServices.deleteFile(file.path)
                await filesRepositories.deleteById(student.avatarFileId, t)
            }
            await studentRepositories.deleteById(id, t)
        })
    },
    getByCourse: async function ({ courseId }) {
        const students = await studentRepositories.getAllByCourseId(courseId, STUDENT_VARIANTS.AVATAR);
        const result = await Promise.all(students.map(async (student) => {
            if (!student.avatar) return student
            const base64 = await fileUploadServices.cleanGetBase64(student.avatar);
            const avatarResult = {
                id: student.avatar.id,
                file: base64,
                name: student.avatar.name,
                mimetype: student.avatar.mimetype
            }
            return { ...student.toJSON(), avatar: avatarResult }
        }))
        return result
    },
    getOne: async function ({ id, user }) {
        const student = await studentRepositories.getByIdAndOrganizationId({ id, organizationId: user.organizationId }, STUDENT_VARIANTS.FULL);
        if (!student) throw ERRORS.E404_3;
        if (!student?.avatar) return student

        const base64 = await fileUploadServices.cleanGetBase64(student.avatar);

        const avatarResult = {
            id: student.avatar.id,
            file: base64,
            name: student.avatar.name,
            mimetype: student.avatar.mimetype
        }
        return { ...student.toJSON(), avatar: avatarResult }
    }
}

module.exports = studentsServices;