
const { TOKENS } = require('../constants/auth');
const ERRORS = require('../constants/errors');
const { STATUSES } = require('../constants/user');
const { USER_PERMISSIONS } = require('../constants/userPermission');
const db = require('../models');
const courseRepositories = require('../repositories/course');
const organizationRepositories = require('../repositories/organization');
const userRepositories = require('../repositories/user');
const userPermissionRepositories = require('../repositories/userPermission');
const encryptationServices = require('./encryptation');
const userPermissionServices = require('./userPermission');
const authServices = {
  login: async ({ email, password }) => {
    const user = await userRepositories.getOneByEmail(email)
    if (!user) throw ERRORS.E401_1;
    const isValidPassword = await encryptationServices.compareTextWithHash(password, user.password)
    if (!isValidPassword) throw ERRORS.E401_1;
    const token = encryptationServices.createToken({ id: user.id, organizationId: user.organizationId }, TOKENS.SESSION.type)
    return { token }
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

  logout: async ({ sessionToken, courseToken }) => {
    //TODO invalidar token de sesión
    //TODO invalidar token de curso
  },
  validUserAccess: async ({ token, permissions: avaiblePermissions = [] }) => {
    const decoded = encryptationServices.validToken(token)
    const tokenData = decoded.data
    const userId = tokenData.id
    const organizationId = tokenData.organizationId
    const userPermissions = await userPermissionRepositories.getByUserId(userId)
    const currentPermissions = userPermissions.map((p) => p.permission)
    if (avaiblePermissions.some((avaiblePermissions) => !currentPermissions.includes(avaiblePermissions))) throw ERRORS.E403
    const userContext = { id: userId, organizationId }
    return userContext
  },
  validCourseAccess: async ({ token }) => {
    const decoded = encryptationServices.validToken(token)
    const tokenData = decoded.data
    const courseId = tokenData.courseId
    const organizationId = tokenData.organizationId
    const course = await courseRepositories.getOneById(courseId)
    if (!course) throw ERRORS.E403
    const courseContext = { id: courseId, organizationId }
    return courseContext
  },
  courseLogin: async ({ accessPin, shortId }) => {
    const course = await courseRepositories.getOneByShortId(shortId)
    if (!course) throw ERRORS.E404_2
    const decryptedAccessPin = encryptationServices.decrypt({ encryptedData: course.accessPin, iv: course.iv })
    if (decryptedAccessPin !== accessPin) throw ERRORS.E401_1
    const token = encryptationServices.createToken({ id: course.id, organizationId: course.organizationId }, TOKENS.COURSE_SESSION.type)
    return { token }
  }
};

module.exports = authServices;
