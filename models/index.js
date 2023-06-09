'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { envConfig } = require('../config/envConfig');
const basename = path.basename(__filename);
const mysql2 = require('mysql2');

const db = {};

let sequelize = new Sequelize(envConfig.MYSQL_CONNECTION, {
  logging: envConfig.MYSQL_LOGGING
    ? (query) =>
      console.log(query, '\n-------------------------------\n')
    : false,
  dialectModule: mysql2,
});

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
