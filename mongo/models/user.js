const mongoose = require('mongoose');
const { MODEL_NAME, STATUSES } = require('../constants/user');
const { MODEL_NAME: ORGANIZATION_MODEL_NAME } = require('../constants/organization');
const { USER_PERMISSIONS } = require('../constants/userPermission');
const { MODEL_NAME: COURSE_MODEL_NAME } = require('../constants/course');


const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    status: { type: String, required: true, enum: Object.values(STATUSES) },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: ORGANIZATION_MODEL_NAME, required: true },
    permissions: [{ type: String, enum: Object.values(USER_PERMISSIONS) }],
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: COURSE_MODEL_NAME }],
});

const User = mongoose.model(MODEL_NAME, userSchema);

module.exports = User;