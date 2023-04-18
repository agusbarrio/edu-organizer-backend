'use strict';
const { Model } = require('sequelize');
const {
  TABLE_NAME,
  MODEL_NAME,
  USER_PERMISSIONS,
} = require('../constants/userPermission');
const _ = require('lodash');

module.exports = (sequelize, DataTypes) => {
  class UserPermission extends Model {
    static associate(models) {
      UserPermission.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
          allowNull: false,
        },
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  UserPermission.init(
    {
      permission: {
        type: DataTypes.ENUM(_.values(USER_PERMISSIONS)),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: MODEL_NAME,
      tableName: TABLE_NAME,
      timestamps: false,
    }
  );
  return UserPermission;
};
