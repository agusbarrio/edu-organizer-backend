const db = require("../models");
const organizationRepositories = require("../repositories/organization");
const { validTargetStudent, validTargetCourse } = require("./targetEntities");
const Organization = require('../models/organization')
const organizationsServices = {
    getAll: async function () {
        const organizations = Organization.find({})
        return organizations
    },
    deleteOne: async function ({ _id }) {
        await Organization.deleteOne({ _id })
    },
    getMyOrganization: async function ({ user }) {
        const organization = await Organization.findOne({ _id: user.organization._id })
        return organization
    },
    editMyOrganization: async function ({ name, user }) {
        await Organization.updateOne({ _id: user.organization._id }, { name })
    },
}

module.exports = organizationsServices;