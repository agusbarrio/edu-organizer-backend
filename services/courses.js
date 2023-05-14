const ERRORS = require("../constants/errors");
const db = require("../models");
const coursesRepositories = require("../repositories/courses");
const { COURSE_VARIANTS } = require("../repositories/variants/courses");
const encryptationServices = require("./encryptation");
const { validTargetCourse } = require("./targetEntities");

const coursesServices = {
    create: async function ({ user, name, accessPin }) {
        const shortId = encryptationServices.createShortId();
        let encrypted
        if (accessPin) encrypted = encryptationServices.encrypt(accessPin);
        await coursesRepositories.create({ organizationId: user.organizationId, name, shortId, accessPin: encrypted?.encryptedData, iv: encrypted?.iv });
    },
    editOne: async function ({ id, name, accessPin, user }) {
        await db.sequelize.transaction(async (t) => {
            let encrypted
            if (accessPin) encrypted = encryptationServices.encrypt(accessPin);
            const course = await validTargetCourse({ organizationId: user.organizationId, id }, t)
            await coursesRepositories.editEntity(course, { name, accessPin: encrypted?.encryptedData, iv: encrypted?.iv }, t)
        })
    },
    getAll: async function ({ user }) {
        const courses = await coursesRepositories.getAllByOrganization(user.organizationId)
        return courses
    },
    deleteOne: async function ({ id, user }) {
        await db.sequelize.transaction(async (t) => {
            await validTargetCourse({ organizationId: user.organizationId, id }, t)
            await coursesRepositories.deleteOneById(id, t)
        })
    },
    getOne: async function ({ id }) {
        const course = await coursesRepositories.getOneById(id, COURSE_VARIANTS.FULL);
        if (!course) throw ERRORS.E404_2;
        return course
    }
}

module.exports = coursesServices;