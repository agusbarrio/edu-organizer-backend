'use strict';
const { STATUSES } = require('../constants/user');
const db = require('../models');
const ABMRepository = require('./ABMRepository');
class UserRepository extends ABMRepository {
  constructor() {
    super(db.User);
  }
  getOneByEmail(email, transaction) {
    return this.model.findOne({ where: { email }, transaction });
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
