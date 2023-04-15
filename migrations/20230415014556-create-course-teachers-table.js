'use strict';
const { TABLE_NAME } = require('../constants/courseTeachers');
const { TABLE_NAME: COURSES_TABLE_NAME } = require('../constants/courses');
const { TABLE_NAME: USERS_TABLE_NAME } = require('../constants/users');

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
      courseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: COURSES_TABLE_NAME,
          key: 'id',
        },
      },
      teacherId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: USERS_TABLE_NAME,
          key: 'id',
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(TABLE_NAME);
  },
};
