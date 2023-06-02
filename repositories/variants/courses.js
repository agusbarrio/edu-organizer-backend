'use strict';
const db = require('../../models');

const COURSE_VARIANTS = {
    LOGIN: 'LOGIN',
    FULL: 'FULL',
    SIMPLE: 'SIMPLE',
}

const COURSE_VARIANTS_OPTIONS = {
    [COURSE_VARIANTS.FULL]: {
        attributes: ['id', 'name', 'organizationId', 'shortId', 'accessPin', 'iv', 'studentAttendanceFormData'],
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
    },
    [COURSE_VARIANTS.SIMPLE]: {
        attributes: ['id', 'name', 'organizationId'],
    },
    [COURSE_VARIANTS.LOGIN]: {
        attributes: ['id', 'accessPin', 'iv', 'name', 'shortId'],
        include: [
            {
                model: db.Organization,
                as: 'organization',
                attributes: ['id'],
            }
        ],
    },
}

module.exports.COURSE_VARIANTS = COURSE_VARIANTS;
module.exports.COURSE_VARIANTS_OPTIONS = COURSE_VARIANTS_OPTIONS;
