'use strict';
const db = require('../models');
const ABMRepository = require('./ABMRepository');
const { COURSE_VARIANTS_OPTIONS } = require('./variants/courses');
class CoursesRepository extends ABMRepository {
    constructor() {
        super(db.Course);
    }
    getAllByOrganization(organizationId) {
        return this.model.findAll({
            where: {
                organizationId
            }
        })
    }
    getOneByShortId(shortId, variant) {
        return this.model.findOne({
            where: {
                shortId
            },
            ...COURSE_VARIANTS_OPTIONS?.[variant]
        })
    }
    getOneById(id, variant, transaction) {
        return this.model.findOne({
            where: {
                id
            },
            transaction,
            ...COURSE_VARIANTS_OPTIONS?.[variant]
        })
    }
    getByIdAndOrganizationId({ id, organizationId }, variant, transaction) {
        return this.model.findOne({
            where: {
                id,
                organizationId
            },
            transaction,
            ...COURSE_VARIANTS_OPTIONS?.[variant]
        })
    }
    getAllByIds(ids, transaction) {
        return this.model.findAll({
            where: {
                id: ids
            },
            transaction
        })
    }
    updateById(ids, data, transaction) {
        return this.model.update(data, {
            where: {
                id: ids
            },
            transaction
        })
    }
}

const coursesRepositories = new CoursesRepository();
module.exports = coursesRepositories;