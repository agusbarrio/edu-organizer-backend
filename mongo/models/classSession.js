const mongoose = require('mongoose');
const { MODEL_NAME } = require('../../constants/classSession');
const { MODEL_NAME: COURSE_MODEL_NAME } = require('../../constants/course');
const { MODEL_NAME: ORGANIZATION_MODEL_NAME } = require('../../constants/organization');
const { MODEL_NAME: CLASS_SESSION_STUDENT_MODEL_NAME } = require('../../constants/classSessionStudent');

const classSessionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: COURSE_MODEL_NAME, required: true },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: ORGANIZATION_MODEL_NAME, required: true },
  classSessionStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: CLASS_SESSION_STUDENT_MODEL_NAME }],
});

const ClassSession = mongoose.model(MODEL_NAME, classSessionSchema);

module.exports = ClassSession;
