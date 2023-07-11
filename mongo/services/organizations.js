const Organization = require('../models/organization')

const organizationsServices = {
    getAll: async function () {
        const organizations = Organization.find({}).select('_id name')
        return organizations
    },
    deleteOne: async function ({ _id }) {
        await Organization.deleteOne({ _id })
        await Course.deleteMany({ organization: _id })
        await Student.deleteMany({ organization: _id })

    },
    getMyOrganization: async function ({ user }) {
        const organization = await Organization.findOne({ _id: user.organization._id }).select('_id name')
        return organization
    },
    editMyOrganization: async function ({ name, user }) {
        await Organization.updateOne({ _id: user.organization._id }, { name })
    },
}

module.exports = organizationsServices;