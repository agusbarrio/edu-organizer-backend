'use strict';
const { STATUSES } = require('../constants/user');
const db = require('../models');
const ABMRepository = require('./ABMRepository');
const { USER_VARIANTS_OPTIONS } = require('./variants/user');

class UserRepository extends ABMRepository {
  constructor() {
    super(db.User);
  }
  getOneByEmail(email, variant, transaction) {
    return this.model.findOne({ where: { email }, transaction, ...USER_VARIANTS_OPTIONS?.[variant] });
  }
  getOneActiveByEmailAndPassword({ email, password }, transaction) {
    return this.model.findOne({
      where: { email, password, status: STATUSES.ACTIVE },
      transaction,
    });
  }
  getAll(variant, transaction) {
    return this.model.findAll({
      transaction,
      ...USER_VARIANTS_OPTIONS?.[variant],
    });
  }
}

const userRepositories = new UserRepository();
module.exports = userRepositories;
