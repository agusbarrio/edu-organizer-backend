'use strict';
const db = require('../models');
const ABMRepository = require('./ABMRepository');
class ClassSessionStudentsRepository extends ABMRepository {
  constructor() {
    super(db.ClassSessionStudent);
  }
}

const classSessionStudentsRepositories = new ClassSessionStudentsRepository();
module.exports = classSessionStudentsRepositories;
