'use strict';
const { TABLE_NAME: FILES_TABLE_NAME } = require('../constants/file');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('students', 'avatarFileId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: FILES_TABLE_NAME,
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('students', 'avatarFileId');
  }
};
