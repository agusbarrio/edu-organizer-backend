'use strict';
const { TABLE_NAME } = require('../constants/classSession');
const {
  TABLE_NAME: ORGANIZATIONS_TABLE_NAME,
} = require('../constants/organization');
const { TABLE_NAME: COURSES_TABLE_NAME } = require('../constants/course');

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
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: COURSES_TABLE_NAME,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      organizationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: ORGANIZATIONS_TABLE_NAME,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(TABLE_NAME);
  },
};
