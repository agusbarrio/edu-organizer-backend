'use strict';
const db = require('../../models');

const STUDENT_VARIANTS = {
    FULL: 'FULL',
    SIMPLE: 'SIMPLE',
    AVATAR: 'AVATAR',
}

const STUDENT_VARIANTS_OPTIONS = {
    [STUDENT_VARIANTS.FULL]: {
        attributes: ['id', 'firstName', 'lastName', 'courseId', 'organizationId', 'birthDate', 'additionalInfo'],
        include: [
            {
                model: db.Organization,
                as: 'organization',
                attributes: ['id', 'shortId'],
            },
            {
                model: db.Course,
                as: 'course',
                attributes: ['id', 'name', 'studentAdditionalInfoFormData', 'studentAttendanceFormData', 'metadata'],
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
                                attributes: ['id', 'name', 'studentAttendanceFormData', 'metadata'],
                            }
                        ]
                    },
                ],
            },
            {
                model: db.File,
                as: 'avatar',
                attributes: ['id', 'path', 'organizationId', 'mimetype', 'name'],
            }
        ],
        order: [['firstName', 'ASC'], ['lastName', 'ASC']]

    },
    [STUDENT_VARIANTS.SIMPLE]: {
        attributes: ['id', 'firstName', 'lastName', 'courseId', 'organizationId', 'avatarFileId', 'birthDate', 'additionalInfo'],
        order: [['firstName', 'ASC'], ['lastName', 'ASC']]

    },
    [STUDENT_VARIANTS.AVATAR]: {
        attributes: ['id', 'firstName', 'lastName', 'courseId', 'organizationId', 'avatarFileId', 'birthDate', 'additionalInfo'],
        include: [
            {
                model: db.File,
                as: 'avatar',
                attributes: ['id', 'path', 'organizationId', 'mimetype', 'name'],
            }
        ],
        order: [['firstName', 'ASC'], ['lastName', 'ASC']]

    }
}

module.exports.STUDENT_VARIANTS = STUDENT_VARIANTS;
module.exports.STUDENT_VARIANTS_OPTIONS = STUDENT_VARIANTS_OPTIONS;
