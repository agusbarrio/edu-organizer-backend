'use strict';
const { Model } = require('sequelize');
const { TABLE_NAME, MODEL_NAME } = require('../constants/student');
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    static associate(models) {
      Student.belongsTo(models.Course, {
        foreignKey: 'courseId',
        as: 'course',
      });
      Student.belongsTo(models.Organization, {
        foreignKey: 'organizationId',
        as: 'organization',
      });
    }
  }
  Student.init(
    {
      name: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: MODEL_NAME,
      tableName: TABLE_NAME,
      timestamps: false,
    }
  );
  return Student;
};
