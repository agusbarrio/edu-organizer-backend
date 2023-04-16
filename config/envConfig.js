'use strict';
require('dotenv').config();
const _ = require('lodash');
const pe = process.env;
module.exports.envConfig = {
  //Required
  MYSQL_CONNECTION: pe.MYSQL_CONNECTION,
  SECRET_KEY_ENCRYPTION: pe.SECRET_KEY_ENCRYPTION,
  JWT_SECRET: pe.JWT_SECRET,
  FRONTEND_URL: pe.FRONTEND_URL,
  SENDGRID_EMAIL: pe.SENDGRID_EMAIL,
  SENDGRID_APIKEY: pe.SENDGRID_APIKEY,
  //Optional
  LOGGING: _.get(pe, 'LOGGING', 'false') === 'true',
  PORT: _.toInteger(_.get(pe, 'PORT', '8080')),
  MYSQL_LOGGING: _.get(pe, 'MYSQL_LOGGING', 'false') === 'true',
};
