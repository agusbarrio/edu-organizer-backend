'use strict';
const db = require('../models');
const ABMRepository = require('./ABMRepository');
class StudentRepository extends ABMRepository {
    constructor() {
        super(db.Student);
    }
    getAllByOrganization(organizationId, withCourse) {
        const where = { organizationId }
        if (withCourse !== undefined) where.courseId = (withCourse) ? { [db.Sequelize.Op.ne]: null } : null
        return this.model.findAll({
            where
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
    updateByCourseId(courseId, data, transaction) {
        return this.model.update(data, {
            where: {
                courseId
            },
            transaction
        })
    }
}

const studentRepositories = new StudentRepository();
module.exports = studentRepositories;