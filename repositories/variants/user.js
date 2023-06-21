'use strict';
const db = require('../../models');

const USER_VARIANTS = {
    LOGIN: 'LOGIN',
    EXISTS: 'EXISTS',
    FULL: 'FULL',
}

const USER_VARIANTS_OPTIONS = {
    [USER_VARIANTS.LOGIN]: {
        attributes: ['id', 'password', 'organizationId', 'status'],
        include: [
            {
                model: db.UserPermission,
                as: 'permissions',
                attributes: ['permission'],
            },
            {
                model: db.Organization,
                as: 'organization',
                attributes: ['id', 'shortId'],
            }
        ],
    },
    [USER_VARIANTS.EXISTS]: {
        attributes: ['id'],
    },
    [USER_VARIANTS.FULL]: {
        attributes: ['id', 'email', 'firstName', 'lastName', 'status', 'organizationId'],
        include: [
            {
                model: db.UserPermission,
                as: 'permissions',
                attributes: ['permission'],
            },
            {
                model: db.Organization,
                as: 'organization',
                attributes: ['id', 'shortId', 'name'],
            },
        ],
    },
}

module.exports.USER_VARIANTS = USER_VARIANTS;
module.exports.USER_VARIANTS_OPTIONS = USER_VARIANTS_OPTIONS;
