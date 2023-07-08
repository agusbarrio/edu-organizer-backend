const mongoose = require('mongoose');
const { MODEL_NAME } = require('../../constants/organization');
const { MODEL_NAME: USER_MODEL_NAME } = require('../../constants/user');

const organizationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: USER_MODEL_NAME }],
});

const Organization = mongoose.model(MODEL_NAME, organizationSchema);

module.exports = Organization;