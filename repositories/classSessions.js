'use strict';
const db = require('../models');
const ABMRepository = require('./ABMRepository');
const { CLASS_SESSION_VARIANTS_OPTIONS, CLASS_SESSION_VARIANTS } = require('./variants/classSession');
class ClassSessionsRepository extends ABMRepository {
  constructor() {
    super(db.ClassSession);
  }
  getAllByOrganization(organizationId, variant) {
    return this.model.findAll({ where: { organizationId }, ...CLASS_SESSION_VARIANTS_OPTIONS?.[variant] })
  }
  getByIdAndOrganizationId({ id, organizationId }, variant = CLASS_SESSION_VARIANTS.SIMPLE, transaction) {
    return this.model.findOne({
      where: {
        id,
        organizationId
      },
      transaction,
      ...CLASS_SESSION_VARIANTS_OPTIONS?.[variant]
    })
  }
}

const classSessionsRepositories = new ClassSessionsRepository();
module.exports = classSessionsRepositories;
