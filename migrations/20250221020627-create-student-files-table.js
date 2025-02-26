'use strict';
const { TABLE_NAME } = require('../constants/studentFiles');
const { TABLE_NAME: STUDENTS_TABLE_NAME } = require('../constants/student');
const {
  TABLE_NAME: FILES_TABLE_NAME,
} = require('../constants/file');

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
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      fileId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: FILES_TABLE_NAME,
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(TABLE_NAME);
  },
};
