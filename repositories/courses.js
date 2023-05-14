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

}

const coursesRepositories = new CoursesRepository();
module.exports = coursesRepositories;