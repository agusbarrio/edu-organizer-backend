'use strict';
const db = require('../../models');

const USER_VARIANTS = {
    LOGIN: 'LOGIN',
}

const USER_VARIANTS_OPTIONS = {
    [USER_VARIANTS.LOGIN]: {
        attributes: ['id', 'password', 'organizationId'],
        include: [
            {
                model: db.UserPermission,
                as: 'permissions',
                attributes: ['permission'],
            },
        ],
    }
}

module.exports.USER_VARIANTS = USER_VARIANTS;
module.exports.USER_VARIANTS_OPTIONS = USER_VARIANTS_OPTIONS;
