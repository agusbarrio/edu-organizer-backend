'use strict';

const { TABLE_NAME } = require('../constants/student');
const { TABLE_NAME: COURSES_TABLE_NAME } = require('../constants/course');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // clear column courseId from students when course has deletedAt
    await queryInterface.sequelize.query(`UPDATE ${TABLE_NAME}
      SET courseId = NULL
      WHERE courseId IS NOT NULL
      AND courseId IN (
        SELECT id
        FROM ${COURSES_TABLE_NAME}
        WHERE deletedAt IS NOT NULL
      )
    `)
  },
  async down(queryInterface, Sequelize) {
    console.log('This migration cannot be undone')
  }
};
