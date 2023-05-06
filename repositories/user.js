'use strict';
const { STATUSES } = require('../constants/user');
const db = require('../models');
const ABMRepository = require('./ABMRepository');
const { USER_VARIANTS_OPTIONS } = require('./variants/user');

class UserRepository extends ABMRepository {
  constructor() {
    super(db.User);
  }
  getOneByEmail(email, variant, transaction,) {
    const variantOptions = USER_VARIANTS_OPTIONS[variant]
    return this.model.findOne({ where: { email }, transaction, ...variantOptions });
  }
  getOneActiveByEmailAndPassword({ email, password }, transaction) {
    return this.model.findOne({
      where: { email, password, status: STATUSES.ACTIVE },
      transaction,
    });
  }
}

const userRepositories = new UserRepository();
module.exports = userRepositories;
