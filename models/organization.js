'use strict';
const { Model } = require('sequelize');
const { TABLE_NAME, MODEL_NAME } = require('../constants/organization');
module.exports = (sequelize, DataTypes) => {
  class Organization extends Model {
    static associate(models) {}
  }
  Organization.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: MODEL_NAME,
      tableName: TABLE_NAME,
      timestamps: false,
    }
  );
  return Organization;
};
