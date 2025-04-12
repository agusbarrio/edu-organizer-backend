'use strict';
const db = require('../models');
const ABMRepository = require('./ABMRepository');
const { STUDENT_VARIANTS, STUDENT_VARIANTS_OPTIONS } = require('./variants/student');
class StudentRepository extends ABMRepository {
    constructor() {
        super(db.Student);
    }
    getAllByOrganization({ organizationId, withCourse, courseId }) {
        const where = { organizationId }
        if (withCourse !== undefined) where.courseId = (withCourse) ? { [db.Sequelize.Op.ne]: null } : null
        if (courseId !== undefined) where.courseId = courseId
        return this.model.findAll({
            where,
            order: [['firstName', 'ASC'], ['lastName', 'ASC']],
            include: [
                {
                    model: db.Course,
                    as: 'course',
                    attributes: ['id', 'name'],
                }
            ]
        })
    }
    getAllByCourseId(courseId, variant = STUDENT_VARIANTS.SIMPLE, transaction) {
        return this.model.findAll({
            where: {
                courseId
            },
            transaction,
            ...STUDENT_VARIANTS_OPTIONS?.[variant]
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
    getOneById(id, variant = STUDENT_VARIANTS.SIMPLE, transaction) {
        return this.model.findOne({
            where: {
                id
            },
            transaction,
            ...STUDENT_VARIANTS_OPTIONS?.[variant]
        })
    }
    getByIdAndOrganizationId({ id, organizationId }, variant = STUDENT_VARIANTS.SIMPLE, transaction) {
        return this.model.findOne({
            where: {
                id,
                organizationId
            },
            transaction,
            ...STUDENT_VARIANTS_OPTIONS?.[variant]
        })
    }
}

const studentRepositories = new StudentRepository();
module.exports = studentRepositories;