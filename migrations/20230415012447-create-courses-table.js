'use strict';
const { TABLE_NAME } = require('../constants/course');
const {
  TABLE_NAME: ORGANIZATIONS_TABLE_NAME,
} = require('../constants/organization');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.createTable(TABLE_NAME, {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      organizationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: ORGANIZATIONS_TABLE_NAME,
          key: 'id',
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.dropTable(TABLE_NAME);
  },
};
