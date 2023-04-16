'use strict';
const { Model } = require('sequelize');
const { TABLE_NAME, MODEL_NAME } = require('../constants/classSession');
module.exports = (sequelize, DataTypes) => {
  class ClassSession extends Model {
    static associate(models) {
      ClassSession.belongsTo(models.Course, {
        foreignKey: 'courseId',
        as: 'course',
      });
      ClassSession.belongsTo(models.Organization, {
        foreignKey: 'organizationId',
        as: 'organization',
      });
    }
  }
  ClassSession.init(
    {
      date: DataTypes.DATEONLY,
    },
    {
      sequelize,
      modelName: MODEL_NAME,
      tableName: TABLE_NAME,
      timestamps: false,
    }
  );
  return ClassSession;
};
