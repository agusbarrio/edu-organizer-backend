const ERRORS = require('../constants/errors');
const db = require('../models');
const organizationRepositories = require('../repositories/organization');
const userRepositories = require('../repositories/user');

const authServices = {
  login: async (req, res, next) => {
    console.log('login');
  },
  /**
   * Servicio de registro de usuario. Crea un usuario y una organización.
   */
  register: async ({
    email,
    password,
    firstName,
    lastName,
    organizationName,
  }) => {
    await db.sequelize.transaction(async (t) => {
      const userExists = await userRepositories.findByEmail(email, t);
      if (userExists) throw ERRORS.E409_1;
      const newOrganization = await organizationRepositories.create(
        { name: organizationName },
        t
      );
      await userRepositories.create(
        {
          email,
          password,
          firstName,
          lastName,
          organizationId: newOrganization.id,
        },
        t
      );
    });
  },
  logout: async (req, res, next) => {
    console.log('logout');
  },
  recoverPassword: async (req, res, next) => {
    console.log('recoverPassword');
  },
};

module.exports = authServices;
