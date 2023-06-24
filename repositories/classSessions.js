'use strict';
const db = require('../models');
const ABMRepository = require('./ABMRepository');
const { CLASS_SESSION_VARIANTS_OPTIONS } = require('./variants/classSession');
class ClassSessionsRepository extends ABMRepository {
  constructor() {
    super(db.ClassSession);
  }
  getAllByOrganization(organizationId, variant) {
    return this.model.findAll({ where: { organizationId }, ...CLASS_SESSION_VARIANTS_OPTIONS?.[variant] })
  }
}

const classSessionsRepositories = new ClassSessionsRepository();
module.exports = classSessionsRepositories;
