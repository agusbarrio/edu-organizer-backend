'use strict';
class ABMRepository {
  constructor(model) {
    this.model = model;
  }
  create(data, transaction) {
    return this.model.create(data, { transaction });
  }
  editOneById(id, data, transaction) {
    return this.model.update(data, { where: { id }, transaction });
  }
  deleteOneById(id, transaction) {
    return this.model.destroy({ where: { id }, transaction });
  }
  getOneById(id, transaction) {
    return this.model.findOne({ where: { id }, transaction });
  }
  getAll(transaction) {
    return this.model.findAll({ transaction });
  }
}

module.exports = ABMRepository;
