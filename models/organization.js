'use strict';
const { Model } = require('sequelize');
const { TABLE_NAME, MODEL_NAME } = require('../constants/organization');
module.exports = (sequelize, DataTypes) => {
  class Organization extends Model {
    static associate(models) { }
  }
  Organization.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      shortId: { type: DataTypes.STRING, allowNull: false, unique: true },
    },
    {
      sequelize,
      modelName: MODEL_NAME,
      tableName: TABLE_NAME,
      timestamps: true,
      paranoid: true,
    }
  );
  return Organization;
};
