
const { TOKENS } = require('../constants/auth');
const EMAIL_TEMPLATES = require('../constants/emailTemplates');
const ERRORS = require('../constants/errors');
const { STATUSES } = require('../constants/user');
const { USER_PERMISSIONS } = require('../constants/userPermission');
const db = require('../models');
const coursesRepositories = require('../repositories/courses');
const organizationRepositories = require('../repositories/organization');
const userRepositories = require('../repositories/user');
const { COURSE_VARIANTS } = require('../repositories/variants/courses');
const { USER_VARIANTS, } = require('../repositories/variants/user');
const { sendMail, getTemplate } = require('./emailNotifications');
const encryptationServices = require('./encryptation');
const userPermissionServices = require('./userPermission');

let isFirstUser

const authServices = {
  login: async ({ email, password }) => {
    const user = await userRepositories.getOneByEmail(email, USER_VARIANTS.LOGIN)
    if (!user) throw ERRORS.E401_1;
    if (user.status !== STATUSES.ACTIVE) throw ERRORS.E403_2;
    const isValidPassword = await encryptationServices.compareTextWithHash(password, user.password)
    if (!isValidPassword) throw ERRORS.E401_1;

    const result = user.toJSON()
    delete result.password
    const token = encryptationServices.createToken({
      user: { ...result, permissions: result.permissions.map((permission) => permission.permission) },
    }, TOKENS.SESSION)
    return { token, user: result }
  },
  registerOrganization: async ({
    email,
    password,
    firstName,
    lastName,
    organizationName,
    status
  }, transaction) => {
    const userExists = await userRepositories.getOneByEmail(email, USER_VARIANTS.EXISTS, transaction);
    if (userExists) throw ERRORS.E409_1;
    const shortId = encryptationServices.createShortId();
    const newOrganization = await organizationRepositories.create(
      { name: organizationName, shortId },
      transaction
    );
    const encryptedPassword = await encryptationServices.convertTextToHash(
      password
    );
    const newUser = await userRepositories.create(
      {
        email,
        password: encryptedPassword,
        status,
        firstName,
        lastName,
        organizationId: newOrganization.id,
      },
      transaction
    );
    const permissions = [
      USER_PERMISSIONS.ADMIN,
      USER_PERMISSIONS.TEACHER,
      USER_PERMISSIONS.OWNER,
    ]
    if (isFirstUser) permissions.push(USER_PERMISSIONS.SUPERADMIN)

    await userPermissionServices.setUserPermissions(
      {
        user: newUser,
        permissions
      },
      transaction
    );

    return newUser;
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
      if (typeof isFirstUser === 'undefined') {
        const usersCount = await userRepositories.countAll(t)
        isFirstUser = usersCount === 0
      }
      const newUser = await authServices.registerOrganization({
        email,
        password,
        firstName,
        lastName,
        organizationName,
        status: STATUSES.PENDING
      }, t);
      const token = encryptationServices.createToken({ id: newUser.id }, TOKENS.VERIFY_ACCOUNT)
      const url = `${process.env.CORS_ORIGIN}/auth/verify-account?token=${token}`
      const mailContent = getTemplate(EMAIL_TEMPLATES.VERIFY_ACCOUNT.key, { url })
      await sendMail(mailContent, newUser.email)
    });
  },
  verifyAccount: async ({ token }) => {
    const decoded = encryptationServices.validToken(token, TOKENS.VERIFY_ACCOUNT)
    const tokenData = decoded.data
    await userRepositories.editOneById(tokenData.id, { status: STATUSES.ACTIVE })
  },
  logout: async ({ sessionToken, courseToken }) => {
    //TODO invalidar token de sesión
    //TODO invalidar token de curso
  },
  validUserAccess: async ({ token, permissions: avaiblePermissions = [] }) => {
    const decoded = encryptationServices.validToken(token, TOKENS.SESSION)
    const tokenData = decoded.data
    const currentPermissions = tokenData.user.permissions
    if (avaiblePermissions.some((avaiblePermissions) => !currentPermissions.includes(avaiblePermissions))) throw ERRORS.E403
    const context = { user: tokenData.user }
    return context
  },
  validCourseAccess: async ({ token }) => {
    const decoded = encryptationServices.validToken(token, TOKENS.COURSE)
    const tokenData = decoded.data
    const context = { course: tokenData.course }
    return context
  },
  courseLogin: async ({ accessPin, shortId }) => {
    const course = await coursesRepositories.getOneByShortId(shortId, COURSE_VARIANTS.LOGIN)
    if (!course) throw ERRORS.E404_2
    if (!course?.accessPin || !course?.iv) throw ERRORS.E401_1
    const decryptedAccessPin = encryptationServices.decrypt({ encryptedData: course.accessPin, iv: course.iv })
    if (decryptedAccessPin !== accessPin) throw ERRORS.E401_1
    const token = encryptationServices.createToken({
      course: { id: course.id, organizationId: course.organization.id, name: course.name, shortId: course.shortId, studentAttendanceFormData: course.studentAttendanceFormData }
    }, TOKENS.COURSE)
    const result = course.toJSON()
    delete result.accessPin
    delete result.iv

    return { token, course: result }
  },
};

module.exports = authServices;
