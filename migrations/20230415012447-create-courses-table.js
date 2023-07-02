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
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      shortId: {
        type: Sequelize.STRING(5),
        allowNull: false,
        unique: true,
      },
      accessPin: {
        type: Sequelize.STRING,
      },
      iv: {
        type: Sequelize.STRING,
      },
      studentAttendanceFormData: {
        type: Sequelize.JSON,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(TABLE_NAME);
  },
};
