'use strict';
const db = require('../models');
const ABMRepository = require('./ABMRepository');
class ClassSessionStudentsRepository extends ABMRepository {
  constructor() {
    super(db.ClassSessionStudent);
  }
  deleteByClassSessionId(classSessionId, transaction) {
    return this.model.destroy({
      where: {
        classSessionId,
      },
      transaction,
    });
  }
}

const classSessionStudentsRepositories = new ClassSessionStudentsRepository();
module.exports = classSessionStudentsRepositories;
