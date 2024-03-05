'use strict';
const { TABLE_NAME: FILES_TABLE_NAME } = require('../constants/file');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add inUse column into files table
    await queryInterface.addColumn(FILES_TABLE_NAME, 'inUse', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(FILES_TABLE_NAME, 'inUse');
  }
};
