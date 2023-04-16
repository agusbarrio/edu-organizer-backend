'use strict';
const { TABLE_NAME, USER_PERMISSIONS } = require('../constants/userPermission');
const { TABLE_NAME: USERS_TABLE_NAME } = require('../constants/user');
const _ = require('lodash');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(TABLE_NAME, {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: USERS_TABLE_NAME,
          key: 'id',
        },
      },
      permission: {
        type: Sequelize.ENUM(_.values(USER_PERMISSIONS)),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(TABLE_NAME);
  },
};
