const ERRORS = require('../constants/errors');
const userPermissionRepositories = require('../repositories/userPermission');
const userRepositories = require('../repositories/user');
const userPermissionServices = {
  setUserPermissions: async ({ user, userId, permissions }, t) => {
    const userToEdit = user || (await userRepositories.getOneById(userId, t));
    if (!userToEdit) throw ERRORS.E404_1;
    await userPermissionRepositories.deleteAllByUserId(userToEdit._id, t);
    await userPermissionRepositories.bulkCreate(
      permissions.map((permission) => ({
        userId: userToEdit._id,
        permission,
      })),
      t
    );
  },
};

module.exports = userPermissionServices;
