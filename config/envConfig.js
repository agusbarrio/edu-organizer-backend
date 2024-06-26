'use strict';
const path = !!process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
console.log('path', path);
require('dotenv').config({ path });

const _ = require('lodash');
const pe = process.env;
module.exports.envConfig = {
  //Required
  MYSQL_CONNECTION: pe.MYSQL_CONNECTION,
  ENCRYPTION_KEY: pe.ENCRYPTION_KEY,
  JWT_SECRET: pe.JWT_SECRET,
  SENDGRID_EMAIL: pe.SENDGRID_EMAIL,
  SENDGRID_APIKEY: pe.SENDGRID_APIKEY,
  //Optional
  LOGGING: _.get(pe, 'LOGGING', 'false') === 'true',
  PORT: _.toInteger(_.get(pe, 'PORT', '8080')),
  MYSQL_LOGGING: _.get(pe, 'MYSQL_LOGGING', 'false') === 'true',
  DEFAULT_TOKEN_DURATION: _.get(pe, 'DEFAULT_TOKEN_DURATION', '1h'),
  COOKIE_EXPIRES_IN_SEG: _.toInteger(_.get(pe, 'COOKIE_EXPIRES_IN_SEG', 1000 * 60 * 60)), // 1 hour
  COOKIE_HTTP_ONLY: _.get(pe, 'COOKIE_HTTP_ONLY', 'true') === 'true',
  COOKIE_SAME_SITE: _.get(pe, 'COOKIE_SAME_SITE', 'Strict'),
  COOKIE_SECURE: _.get(pe, 'COOKIE_SECURE', 'true') === 'true',
  COOKIE_DOMAIN: pe.COOKIE_DOMAIN,
  CORS_ORIGIN: pe.CORS_ORIGIN,
  CORS_CONFIG_ENABLED: _.get(pe, 'CORS_CONFIG_ENABLED', 'true') === 'true',
  COOKIES_CONFIG_ENABLED: _.get(pe, 'COOKIES_CONFIG_ENABLED', 'true') === 'true',
  MULTER_DESTINATION: _.get(pe, 'MULTER_DESTINATION', 'uploads/'),
};
