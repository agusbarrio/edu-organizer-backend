'use strict';
const db = require('../models');
const ABMRepository = require('./ABMRepository');
class UserRepository extends ABMRepository {
  constructor() {
    super(db.User);
  }
  getOneByEmail(email, transaction) {
    return this.model.findOne({ where: { email }, transaction });
  }
}

const userRepositories = new UserRepository();
module.exports = userRepositories;
