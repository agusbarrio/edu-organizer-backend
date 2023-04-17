'use strict';
const db = require('../models');
const ABMRepository = require('./ABMRepository');
class OrganizationRepository extends ABMRepository {
  constructor() {
    super(db.Organization);
  }
}

const organizationRepositories = new OrganizationRepository();
module.exports = organizationRepositories;
