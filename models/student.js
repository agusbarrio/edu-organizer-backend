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
      Student.belongsTo(models.File, {
        foreignKey: {
          name: 'avatarFileId',
          allowNull: true,
        },
        otherKey: 'fileId',
        as: 'avatar',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });

      Student.belongsToMany(models.File, {
        through: models.StudentFile,
        foreignKey: 'studentId',
        as: 'files',
        otherKey: 'fileId',
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
      birthDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      additionalInfo: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: MODEL_NAME,
      tableName: TABLE_NAME,
      timestamps: false,
      paranoid: false,
    }
  );
  return Student;
};
