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

}

const studentRepositories = new StudentRepository();
module.exports = studentRepositories;