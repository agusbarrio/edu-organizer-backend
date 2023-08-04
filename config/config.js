'use strict';
//use NODE_ENV to set the environment
const path = !!process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
require('dotenv').config({ path });

console.log('MYSQL_CONNECTION', process.env.MYSQL_CONNECTION)

module.exports = {
  use_env_variable: 'MYSQL_CONNECTION',
};
