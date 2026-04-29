'use strict';

const ERRORS = require('../constants/errors');
const coursesRepositories = require('../repositories/courses');
const { COURSE_VARIANTS } = require('../repositories/variants/courses');

function buildTeacherCourseContext(courseInstance) {
  const j = courseInstance.toJSON();
  return {
    id: j.id,
    organizationId: j.organizationId,
    name: j.name,
    shortId: j.shortId,
    studentAttendanceFormData: j.studentAttendanceFormData,
    studentAdditionalInfoFormData: j.studentAdditionalInfoFormData,
    metadata: j.metadata,
  };
}

async function teacherCourseAccess(req, res, next) {
  try {
    const courseId = Number(req.params.courseId);
    if (!Number.isInteger(courseId) || courseId < 1) {
      throw ERRORS.E400;
    }
    const user = req.user;
    const course = await coursesRepositories.getByIdAssignedToTeacher(
      {
        id: courseId,
        teacherId: user.id,
        organizationId: user.organizationId,
      },
      COURSE_VARIANTS.TEACHER_ACCESS
    );
    if (!course) {
      throw ERRORS.E403_1;
    }
    req.teacherCourse = buildTeacherCourseContext(course);
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  teacherCourseAccess,
  buildTeacherCourseContext,
};
