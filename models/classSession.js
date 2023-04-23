'use strict';
const { Model } = require('sequelize');
const { TABLE_NAME, MODEL_NAME } = require('../constants/classSession');

module.exports = (sequelize, DataTypes) => {
  class ClassSession extends Model {
    static associate(models) {
      ClassSession.belongsTo(models.Course, {
        foreignKey: {
          name: 'courseId',
          allowNull: false,
        },
        as: 'course',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      ClassSession.belongsTo(models.Organization, {
        foreignKey: {
          name: 'organizationId',
          allowNull: false,
        },
        as: 'organization',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      ClassSession.belongsToMany(models.Student, {
        through: {
          model: models.ClassSessionStudent,
        },
        foreignKey: 'classSessionId',
        as: 'students',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  ClassSession.init(
    {
      date: { type: DataTypes.DATEONLY, allowNull: false },
    },
    {
      sequelize,
      modelName: MODEL_NAME,
      tableName: TABLE_NAME,
      timestamps: false,
      paranoid: true,
    }
  );
  return ClassSession;
};
