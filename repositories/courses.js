'use strict';
const db = require('../models');
const ABMRepository = require('./ABMRepository');
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
    getOneByShortId(shortId) {
        return this.model.findOne({
            where: {
                shortId
            }
        })
    }

}

const coursesRepositories = new CoursesRepository();
module.exports = coursesRepositories;