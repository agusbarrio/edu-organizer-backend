const ERRORS = require('../constants/errors');
const { STATUSES } = require('../constants/user');
const { USER_PERMISSIONS } = require('../constants/userPermission');
const db = require('../models');
const organizationRepositories = require('../repositories/organization');
const userRepositories = require('../repositories/user');
const userPermissionRepositories = require('../repositories/userPermission');
const encryptationServices = require('./encryptation');
const userPermissionServices = require('./userPermission');
const authServices = {
  login: async ({ email, password }) => {
    const encryptedIncomingPassword =
      await encryptationServices.convertTextToHash(password);
    const user = await userRepositories.getOneActiveByEmailAndPassword({
      email,
      password: encryptedIncomingPassword,
    });
    if (!user) throw ERRORS.E401_1;
    //Crear y guardar token
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
      const encryptedPassword = await encryptationServices.convertTextToHash(
        password
      );
      const newUser = await userRepositories.create(
        {
          email,
          password: encryptedPassword,
          status: STATUSES.ACTIVE,
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
