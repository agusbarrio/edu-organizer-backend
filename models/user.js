'use strict';
const { Model } = require('sequelize');
const { TABLE_NAME, MODEL_NAME, STATUSES } = require('../constants/user');
const _ = require('lodash');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Organization, {
        foreignKey: {
          name: 'organizationId',
          allowNull: false,
        },
        as: 'organization',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      User.hasMany(models.UserPermission, {
        foreignKey: {
          name: 'userId',
          allowNull: false,
        },
        as: 'permissions',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      User.belongsToMany(models.Course, {
        as: 'courses',
        foreignKey: 'teacherId',
        through: models.CourseTeacher,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(_.values(STATUSES)),
        allowNull: false,
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
  return User;
};
