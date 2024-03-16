'use strict';
const { TABLE_NAME: COURSES_TABLE_NAME } = require('../constants/course');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(COURSES_TABLE_NAME, 'studentAdditionalInfoFormData', {
      type: Sequelize.JSON,
      allowNull: true,
    });
    //add metadata
    await queryInterface.addColumn(COURSES_TABLE_NAME, 'metadata', {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(COURSES_TABLE_NAME, 'studentAdditionalInfoFormData');
    await queryInterface.removeColumn(COURSES_TABLE_NAME, 'metadata');
  }
};
