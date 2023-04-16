'use strict';
const { Model } = require('sequelize');
const {
  TABLE_NAME,
  MODEL_NAME,
  USER_PERMISSIONS,
} = require('../constants/userPermission');
module.exports = (sequelize, DataTypes) => {
  class UserPermission extends Model {
    static associate(models) {
      UserPermission.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }
  UserPermission.init(
    {
      permission: DataTypes.ENUM(_.values(USER_PERMISSIONS)),
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
