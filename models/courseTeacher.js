'use strict';
const { Model } = require('sequelize');
const { TABLE_NAME, MODEL_NAME } = require('../constants/courseTeacher');
module.exports = (sequelize, DataTypes) => {
  class CourseTeacher extends Model {
    static associate(models) {
      CourseTeacher.belongsTo(models.Course, {
        foreignKey: {
          name: 'courseId',
          allowNull: false,
        },
        as: 'course',
      });
      CourseTeacher.belongsTo(models.User, {
        foreignKey: {
          name: 'teacherId',
          allowNull: false,
        },
        as: 'teacher',
      });
    }
  }
  CourseTeacher.init(
    {},
    {
      sequelize,
      modelName: MODEL_NAME,
      tableName: TABLE_NAME,
      timestamps: false,
    }
  );
  return CourseTeacher;
};
