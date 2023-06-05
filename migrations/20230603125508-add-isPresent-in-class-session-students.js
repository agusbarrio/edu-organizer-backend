'use strict';
const { TABLE_NAME } = require('../constants/classSessionStudent');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(TABLE_NAME, 'isPresent', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(TABLE_NAME, 'isPresent');
  }
};
