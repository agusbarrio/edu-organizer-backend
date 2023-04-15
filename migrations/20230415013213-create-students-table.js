'use strict';
const { TABLE_NAME } = require('../constants/students');
const {
  TABLE_NAME: ORGANIZATIONS_TABLE_NAME,
} = require('../constants/organizations');
const { TABLE_NAME: COURSES_TABLE_NAME } = require('../constants/courses');

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
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: COURSES_TABLE_NAME,
          key: 'id',
        },
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
    await queryInterface.dropTable(TABLE_NAME);
  },
};
