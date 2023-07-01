'use strict';
const { Model } = require('sequelize');
const { TABLE_NAME, MODEL_NAME } = require('../constants/classSessionStudent');
module.exports = (sequelize, DataTypes) => {
  class ClassSessionStudent extends Model {
    static associate(models) {
      ClassSessionStudent.belongsTo(models.Student, {
        foreignKey: {
          name: 'studentId',
          allowNull: false,
        },
        as: 'student',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      ClassSessionStudent.belongsTo(models.ClassSession, {
        foreignKey: {
          name: 'classSessionId',
          allowNull: false,
        },
        as: 'classSession',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  ClassSessionStudent.init(
    {
      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      isPresent: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: MODEL_NAME,
      tableName: TABLE_NAME,
      timestamps: true,
      paranoid: true,
    }
  );
  return ClassSessionStudent;
};
