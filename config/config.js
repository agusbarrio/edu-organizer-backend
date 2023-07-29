'use strict';
//use NODE_ENV to set the environment
const path = !!process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
require('dotenv').config({ path });

module.exports = {
  use_env_variable: 'MYSQL_CONNECTION',
};
