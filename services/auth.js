const ERRORS = require('../constants/errors');
const { USER_PERMISSIONS } = require('../constants/userPermission');
const db = require('../models');
const organizationRepositories = require('../repositories/organization');
const userRepositories = require('../repositories/user');
const userPermissionRepositories = require('../repositories/userPermission');
const userPermissionServices = require('./userPermission');
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
      const userExists = await userRepositories.getOneByEmail(email, t);
      if (userExists) throw ERRORS.E409_1;
      const newOrganization = await organizationRepositories.create(
        { name: organizationName },
        t
      );
      const newUser = await userRepositories.create(
        {
          email,
          password,
          firstName,
          lastName,
          organizationId: newOrganization.id,
        },
        t
      );
      await userPermissionServices.setUserPermissions(
        {
          user: newUser,
          permissions: [
            USER_PERMISSIONS.ADMIN,
            USER_PERMISSIONS.TEACHER,
            USER_PERMISSIONS.OWNER,
          ],
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
