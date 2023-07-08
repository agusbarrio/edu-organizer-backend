
const mongoose = require('mongoose');

const { MODEL_NAME } = require('../../constants/classSessionStudent');
const { MODEL_NAME: STUDENT_MODEL_NAME } = require('../../constants/student');
const { MODEL_NAME: CLASS_SESSION_MODEL_NAME } = require('../../constants/classSession');
const { MODEL_NAME: ORGANIZATION_MODEL_NAME } = require('../../constants/organization');

const classSessionStudentSchema = new mongoose.Schema({
  metadata: { type: mongoose.Schema.Types.Mixed, required: false },
  isPresent: { type: Boolean, required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: STUDENT_MODEL_NAME, required: true },
  classSession: { type: mongoose.Schema.Types.ObjectId, ref: CLASS_SESSION_MODEL_NAME, required: true },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: ORGANIZATION_MODEL_NAME, required: true },
});

const ClassSessionStudent = mongoose.model(MODEL_NAME, classSessionStudentSchema);

module.exports = ClassSessionStudent;