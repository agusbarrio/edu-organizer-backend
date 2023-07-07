const mongoose = require('mongoose');
const { MODEL_NAME } = require('../constants/student');
const { MODEL_NAME: COURSE_MODEL_NAME } = require('../constants/course');
const { MODEL_NAME: ORGANIZATION_MODEL_NAME } = require('../constants/organization');
const { MODEL_NAME: CLASS_SESSION_MODEL_NAME } = require('../constants/classSession');
const { MODEL_NAME: CLASS_SESSION_STUDENT_MODEL_NAME } = require('../constants/classSessionStudent');

const studentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: COURSE_MODEL_NAME },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: ORGANIZATION_MODEL_NAME, required: true },
    classSessions: [{ type: mongoose.Schema.Types.ObjectId, ref: CLASS_SESSION_MODEL_NAME }],
    classSessionsStudent: [{ type: mongoose.Schema.Types.ObjectId, ref: CLASS_SESSION_STUDENT_MODEL_NAME }],
});

const Student = mongoose.model(MODEL_NAME, studentSchema);

module.exports = Student;