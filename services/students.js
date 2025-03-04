const ERRORS = require("../constants/errors");
const db = require("../models");
const studentRepositories = require("../repositories/student");
const filesRepositories = require("../repositories/files");
const { STUDENT_VARIANTS } = require("../repositories/variants/student");
const fileUploadServices = require("./files");

const { validTargetStudent, validTargetCourse, validTargetFile, validTargetFiles } = require("./targetEntities");
const fileSystemServices = require("./fileSystem");
const studentFilesRepositories = require("../repositories/studentFiles");
const { isEmpty } = require("lodash");

const studentsServices = {
    create: async function ({ organizationId, firstName, lastName, courseId, avatarFileId, birthDate, additionalInfo, filesIds }) {
        await db.sequelize.transaction(async (t) => {
            if (courseId) await validTargetCourse({ organizationId, id: courseId }, t)
            if (avatarFileId) {
                const file = await validTargetFile({ organizationId, id: avatarFileId }, t)
                filesRepositories.editEntity(file, { inUse: true }, t)
            }


            const student = await studentRepositories.create({ organizationId, firstName, lastName, courseId, avatarFileId, birthDate, additionalInfo }, t)

            if (!isEmpty(filesIds)) {
                const filesEntities = await validTargetFiles({ organizationId, ids: filesIds }, t)
                await filesRepositories.updateById(filesEntities.map(file => file.id), { inUse: true }, t)
                await student.setFiles(filesIds, { transaction: t })
            }
            return student
        })
    },
    editOne: async function ({ id, firstName, lastName, courseId, user, avatarFileId, birthDate, additionalInfo, filesIds }) {
        await db.sequelize.transaction(async (t) => {
            const organizationId = user.organizationId
            if (courseId) await validTargetCourse({ organizationId, id: courseId }, t)
            const student = await validTargetStudent({ organizationId, id }, t)
            if (avatarFileId) {
                const file = await validTargetFile({ organizationId, id: avatarFileId }, t)
                filesRepositories.editEntity(file, { inUse: true }, t)
            }
            if (student.avatarFileId && student.avatarFileId !== avatarFileId) {
                const oldFile = await filesRepositories.getOneById(student.avatarFileId, t)
                await filesRepositories.deleteById(student.avatarFileId, t)
                await fileSystemServices.deleteFile(oldFile.path)
            }

            if (filesIds) {
                const oldFiles = await studentFilesRepositories.getAllByStudentId(student.id, t)
                const oldFilesIds = oldFiles.map(file => file.fileId)
                const newFiles = await validTargetFiles({ organizationId, ids: filesIds }, t)
                const newFilesIds = newFiles.map(file => file.id)
                const filesToDelete = oldFilesIds.filter(id => !newFilesIds.includes(id))
                const filesToUse = newFilesIds.filter(id => !oldFilesIds.includes(id))
                if (filesToDelete.length > 0) {
                    await studentFilesRepositories.deleteByStudentIdAndFileId(student.id, filesToDelete, t)
                    await filesRepositories.updateById(filesToDelete, { inUse: false }, t)
                }
                if (filesToUse.length > 0) {
                    await studentFilesRepositories.bulkCreate(filesToUse.map(fileId => ({ studentId: student.id, fileId })), t)
                    await filesRepositories.updateById(filesToUse, { inUse: true }, t)
                }
            }
            await studentRepositories.editEntity(student, { firstName, lastName, courseId, avatarFileId, birthDate, additionalInfo }, t)
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
            const studentFiles = await studentFilesRepositories.getByStudentId(student.id, t)
            if (!isEmpty(studentFiles)) {
                await filesRepositories.updateById(studentFiles.map(file => file.fileId), { inUse: false }, t)
                await studentFilesRepositories.deleteByStudentId(student.id, t)
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
        let result = student.toJSON()
        if (student?.avatar) {
            const base64 = await fileUploadServices.cleanGetBase64(student.avatar);

            const avatarResult = {
                id: student.avatar.id,
                file: base64,
                name: student.avatar.name,
                mimetype: student.avatar.mimetype
            }
            result = {
                ...result,
                avatar: avatarResult
            }
        }

        if (!isEmpty(student.files)) {
            const base64Files = await fileUploadServices.cleanGetMultipleBase64(student.files);
            const filesResult = student.files.map((file, index) => ({
                id: file.id,
                file: base64Files[index],
                name: file.name,
                mimetype: file.mimetype
            }))
            result = {
                ...result,
                files: filesResult
            }
        }
        return result
    }
}

module.exports = studentsServices;