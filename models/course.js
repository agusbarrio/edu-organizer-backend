'use strict';
const { Model } = require('sequelize');
const { TABLE_NAME, MODEL_NAME } = require('../constants/course');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      Course.belongsTo(models.Organization, {
        foreignKey: {
          name: 'organizationId',
          allowNull: false,
        },
        as: 'organization',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Course.hasMany(models.Student, {
        foreignKey: {
          name: 'courseId',
          allowNull: true,
        },
        as: 'students',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
      Course.belongsToMany(models.User, {
        as: 'teachers',
        foreignKey: 'courseId',
        through: models.CourseTeacher,
      });
    }
  }
  Course.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      shortId: {
        type: DataTypes.STRING(5),
        allowNull: false,
        unique: true,
      },
      accessPin: {
        type: DataTypes.STRING,
      },
      iv: {
        type: DataTypes.STRING,
      },
      studentAttendanceFormData: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      studentAdditionalInfoFormData: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      metadata: {
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
  return Course;
};
