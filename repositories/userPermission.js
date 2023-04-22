'use strict';
const db = require('../models');
const ABMRepository = require('./ABMRepository');
class UserPermissionRepository extends ABMRepository {
  constructor() {
    super(db.UserPermission);
  }
  deleteAllByUserId(userId, transaction) {
    return this.model.destroy({ where: { userId }, transaction });
  }
  getByUserId(userId, transaction) {
    return this.model.findAll({ where: { userId } }, transaction)
  }
}

const userPermissionRepositories = new UserPermissionRepository();
module.exports = userPermissionRepositories;
