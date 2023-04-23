'use strict';
const db = require('../models');
const ABMRepository = require('./ABMRepository');
class ClassSessionsRepository extends ABMRepository {
  constructor() {
    super(db.ClassSession);
  }
}

const classSessionsRepositories = new ClassSessionsRepository();
module.exports = classSessionsRepositories;
