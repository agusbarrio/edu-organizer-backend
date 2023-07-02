'use strict';
const db = require('../../models');

const CLASS_SESSION_VARIANTS = {
    FULL: 'FULL',
    LIST: 'LIST',
    SIMPLE: 'SIMPLE',
}

const CLASS_SESSION_VARIANTS_OPTIONS = {
    [CLASS_SESSION_VARIANTS.FULL]: {
        attributes: ['id', 'date', 'courseId', 'organizationId',],
        include: [
            {
                model: db.Course,
                as: 'course',
                attributes: ['id', 'name', 'studentAttendanceFormData'],
            },
            {
                model: db.ClassSessionStudent,
                as: 'classSessionStudents',
                attributes: ['id', 'classSessionId', 'studentId', 'metadata', 'isPresent',],
                include: [
                    {
                        model: db.Student,
                        as: 'student',
                        attributes: ['id', 'firstName', 'lastName'],
                    }
                ]
            },
        ],
    },
    [CLASS_SESSION_VARIANTS.LIST]: {
        attributes: ['id', 'date', 'courseId', 'organizationId',],
        include: [
            {
                model: db.Course,
                as: 'course',
                attributes: ['id', 'name'],
            },
        ],
    },
    [CLASS_SESSION_VARIANTS.SIMPLE]: {
        attributes: ['id', 'date', 'courseId', 'organizationId',],
    },
}

module.exports.CLASS_SESSION_VARIANTS = CLASS_SESSION_VARIANTS;
module.exports.CLASS_SESSION_VARIANTS_OPTIONS = CLASS_SESSION_VARIANTS_OPTIONS;
