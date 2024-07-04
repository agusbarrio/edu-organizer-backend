'use strict';
const db = require('../../models');

const COURSE_VARIANTS = {
    LOGIN: 'LOGIN',
    FULL: 'FULL',
    SIMPLE: 'SIMPLE',
    REPORT: 'REPORT',
}

const COURSE_VARIANTS_OPTIONS = {
    [COURSE_VARIANTS.FULL]: {
        attributes: ['id', 'name', 'organizationId', 'shortId', 'accessPin', 'iv', 'studentAttendanceFormData', 'studentAdditionalInfoFormData', 'metadata'],
        include: [
            {
                model: db.Organization,
                as: 'organization',
                attributes: ['id', 'shortId'],
            },
            {
                model: db.Student,
                as: 'students',
                attributes: ['id', 'firstName', 'lastName'],
            },
            {
                model: db.User,
                as: 'teachers',
                foreignKey: 'courseId',
                through: {
                    model: db.CourseTeacher,
                    as: 'courseTeachers',
                    foreignKey: 'teacherId',
                },
                attributes: ['id', 'firstName', 'lastName', 'email'],
            }
        ],
        order: [[{ model: db.Student, as: 'students' }, 'firstName', 'ASC'], [{ model: db.Student, as: 'students' }, 'lastName', 'ASC']]
    },
    [COURSE_VARIANTS.SIMPLE]: {
        attributes: ['id', 'name', 'organizationId', 'studentAttendanceFormData', 'studentAdditionalInfoFormData', 'metadata'],
    },
    [COURSE_VARIANTS.LOGIN]: {
        attributes: ['id', 'accessPin', 'iv', 'name', 'shortId', 'studentAttendanceFormData', 'studentAdditionalInfoFormData', 'metadata'],
        include: [
            {
                model: db.Organization,
                as: 'organization',
                attributes: ['id'],
            }
        ],
    },
    [COURSE_VARIANTS.REPORT]: {
        attributes: ['id', 'name', 'organizationId', 'shortId', 'accessPin', 'iv', 'studentAttendanceFormData', 'studentAdditionalInfoFormData', 'metadata'],
        include: [
            {
                model: db.Organization,
                as: 'organization',
                attributes: ['id', 'shortId'],
            },
            {
                model: db.Student,
                as: 'students',
                attributes: ['id', 'firstName', 'lastName'],
                include: [
                    {
                        model: db.ClassSessionStudent,
                        as: 'classSessionsStudent',
                        attributes: ['id', 'classSessionId', 'isPresent'],
                    }
                ],
            },
            {
                model: db.ClassSession,
                as: 'classSessions',
                attributes: ['id', 'date'],
            }
        ],
        order: [[{ model: db.Student, as: 'students' }, 'firstName', 'ASC'], [{ model: db.Student, as: 'students' }, 'lastName', 'ASC']]
    },
}


module.exports.COURSE_VARIANTS = COURSE_VARIANTS;
module.exports.COURSE_VARIANTS_OPTIONS = COURSE_VARIANTS_OPTIONS;
