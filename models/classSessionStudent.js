'use strict';
const { Model } = require('sequelize');
const { TABLE_NAME, MODEL_NAME } = require('../constants/classSessionStudent');
module.exports = (sequelize, DataTypes) => {
  class ClassSessionStudent extends Model {
    static associate(models) {
      ClassSessionStudent.belongsTo(models.Student, {
        foreignKey: 'studentId',
        as: 'student',
      });
      ClassSessionStudent.belongsTo(models.ClassSession, {
        foreignKey: 'classSessionId',
        as: 'classSession',
      });
    }
  }
  ClassSessionStudent.init(
    {},
    {
      sequelize,
      modelName: MODEL_NAME,
      tableName: TABLE_NAME,
      timestamps: false,
    }
  );
  return ClassSessionStudent;
};
