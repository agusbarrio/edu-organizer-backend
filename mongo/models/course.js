const mongoose = require('mongoose');
const { MODEL_NAME } = require('../../constants/course');
const { MODEL_NAME: ORGANIZATION_MODEL_NAME } = require('../../constants/organization');
const { MODEL_NAME: STUDENT_MODEL_NAME } = require('../../constants/student');
const { MODEL_NAME: USER_MODEL_NAME } = require('../../constants/user');
const { MODEL_NAME: CLASS_SESSION_MODEL_NAME } = require('../../constants/classSession');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  accessPin: { type: String },
  iv: { type: String },
  studentAttendanceFormData: { type: mongoose.Schema.Types.Mixed, default: null },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: ORGANIZATION_MODEL_NAME, required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: STUDENT_MODEL_NAME }],
  teachers: [{ type: mongoose.Schema.Types.ObjectId, ref: USER_MODEL_NAME }],
  classSessions: [{ type: mongoose.Schema.Types.ObjectId, ref: CLASS_SESSION_MODEL_NAME }],
});

const Course = mongoose.model(MODEL_NAME, courseSchema);

module.exports = Course;
