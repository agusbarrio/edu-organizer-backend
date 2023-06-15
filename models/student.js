'use strict';
const { Model } = require('sequelize');
const { TABLE_NAME, MODEL_NAME } = require('../constants/student');

module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    static associate(models) {
      Student.belongsTo(models.Course, {
        foreignKey: {
          name: 'courseId',
          allowNull: true,
        },
        as: 'course',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
      Student.belongsTo(models.Organization, {
        foreignKey: {
          name: 'organizationId',
          allowNull: false,
        },
        as: 'organization',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Student.belongsToMany(models.ClassSession, {
        through: models.ClassSessionStudent,
        foreignKey: 'studentId',
        as: 'classSessions',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Student.hasMany(models.ClassSessionStudent, {
        foreignKey: 'studentId',
        as: 'classSessionsStudent',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Student.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: MODEL_NAME,
      tableName: TABLE_NAME,
      timestamps: true,
      paranoid: true,
    }
  );
  return Student;
};
