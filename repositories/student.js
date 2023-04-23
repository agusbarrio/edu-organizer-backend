'use strict';
const db = require('../models');
const ABMRepository = require('./ABMRepository');
class StudentRepository extends ABMRepository {
    constructor() {
        super(db.Student);
    }
    getAllByOrganization(organizationId) {
        return this.model.findAll({
            where: {
                organizationId
            }
        })
    }
    getAllByCourseId(courseId) {
        return this.model.findAll({
            where: {
                courseId
            }
        })
    }
    getAllByIds(ids) {
        return this.model.findAll({
            where: {
                id: ids
            }
        })
    }
}

const studentRepositories = new StudentRepository();
module.exports = studentRepositories;