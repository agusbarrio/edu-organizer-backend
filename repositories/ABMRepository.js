'use strict';
const _ = require('lodash')
class ABMRepository {
  constructor(model) {
    this.model = model;
  }
  async create(data, transaction) {
    return await this.model.create(data, { transaction });
  }
  async editOneById(id, data, transaction) {
    const entity = await this.model.findByPk(id, { transaction });
    _.keys(data).forEach((dataKey) => {
      if (data[dataKey] !== undefined) entity[dataKey] = data[dataKey]
    })
    await entity.save({ transaction })
    return entity
  }
  async editEntity(entity, data, transaction) {
    _.keys(data).forEach((dataKey) => {
      if (data[dataKey] !== undefined) entity[dataKey] = data[dataKey]
    })
    await entity.save({ transaction })
    return entity
  }
  async deleteById(id, transaction, options = {}) {
    return await this.model.destroy({ where: { id }, transaction, ...options });
  }
  async getOneById(id, transaction) {
    return await this.model.findOne({ where: { id }, transaction });
  }
  async getAll(transaction) {
    return await this.model.findAll({ transaction });
  }
  async bulkCreate(data, transaction) {
    return await this.model.bulkCreate(data, { transaction });
  }
  async countAll(transaction) {
    return await this.model.count({ transaction });
  }
}

module.exports = ABMRepository;
