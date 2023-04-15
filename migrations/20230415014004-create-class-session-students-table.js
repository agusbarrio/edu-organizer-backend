'use strict';
const { TABLE_NAME } = require('../constants/classSessionStudents');
const { TABLE_NAME: STUDENTS_TABLE_NAME } = require('../constants/students');
const {
  TABLE_NAME: CLASS_SESSIONS_TABLE_NAME,
} = require('../constants/classSessions');

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
      studentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: STUDENTS_TABLE_NAME,
          key: 'id',
        },
      },
      classSessionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: CLASS_SESSIONS_TABLE_NAME,
          key: 'id',
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(TABLE_NAME);
  },
};
