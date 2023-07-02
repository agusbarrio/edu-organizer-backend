'use strict';
const db = require('../../models');

const STUDENT_VARIANTS = {
    FULL: 'FULL',
    SIMPLE: 'SIMPLE',
}

const STUDENT_VARIANTS_OPTIONS = {
    [STUDENT_VARIANTS.FULL]: {
        attributes: ['id', 'firstName', 'lastName', 'courseId', 'organizationId',],
        include: [
            {
                model: db.Organization,
                as: 'organization',
                attributes: ['id', 'shortId'],
            },
            {
                model: db.Course,
                as: 'course',
                attributes: ['id', 'name'],
            },
            {
                model: db.ClassSessionStudent,
                as: 'classSessionsStudent',
                attributes: ['id', 'classSessionId', 'studentId', 'metadata', 'isPresent',],
                include: [
                    {
                        model: db.ClassSession,
                        as: 'classSession',
                        attributes: ['id', 'date', 'courseId', 'organizationId',],
                        include: [
                            {
                                model: db.Course,
                                as: 'course',
                                attributes: ['id', 'name'],
                            }
                        ]
                    },
                ],
            },
        ],
    },
    [STUDENT_VARIANTS.SIMPLE]: {
        attributes: ['id', 'firstName', 'lastName', 'courseId', 'organizationId',],
    },
}

module.exports.STUDENT_VARIANTS = STUDENT_VARIANTS;
module.exports.STUDENT_VARIANTS_OPTIONS = STUDENT_VARIANTS_OPTIONS;
