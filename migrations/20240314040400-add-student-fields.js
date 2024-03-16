'use strict';
const { TABLE_NAME: STUDENTS_TABLE_NAME } = require('../constants/student');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(STUDENTS_TABLE_NAME, 'additionalInfo', {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn(STUDENTS_TABLE_NAME, 'birthDate', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(STUDENTS_TABLE_NAME, 'additionalInfo');
    await queryInterface.removeColumn(STUDENTS_TABLE_NAME, 'birthDate');
  }
};
