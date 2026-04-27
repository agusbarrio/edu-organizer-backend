
const { TOKENS } = require('../constants/auth');
const EMAIL_TEMPLATES = require('../constants/emailTemplates');
const ERRORS = require('../constants/errors');
const { STATUSES } = require('../constants/user');
const coursesRepositories = require('../repositories/courses');
const userRepositories = require('../repositories/user');
const { COURSE_VARIANTS } = require('../repositories/variants/courses');
const { USER_VARIANTS, } = require('../repositories/variants/user');
const { sendMail, getTemplate } = require('./emailNotifications');
const encryptationServices = require('./encryptation');

function buildLoginJwt(user) {
  const result = user.toJSON();
  delete result.password;
  const token = encryptationServices.createToken({
    user: { ...result, permissions: result.permissions.map((permission) => permission.permission) },
  }, TOKENS.SESSION);
  return { token, user: result };
}

const authServices = {
  login: async ({ email, password }) => {
    const user = await userRepositories.getOneByEmail(email, USER_VARIANTS.LOGIN)
    if (!user) throw ERRORS.E401_1;
    if (user.status !== STATUSES.ACTIVE) throw ERRORS.E403_2;
    if (!user.password) throw ERRORS.E401_1;
    const isValidPassword = await encryptationServices.compareTextWithHash(password, user.password)
    if (!isValidPassword) throw ERRORS.E401_1;

    return buildLoginJwt(user);
  },
  validateOAuthUser: async ({ email }) => {
    if (!email) throw ERRORS.E401_1;
    const user = await userRepositories.getOneByEmail(email, USER_VARIANTS.LOGIN);
    if (!user) throw ERRORS.E401_1;
    if (user.status !== STATUSES.ACTIVE) throw ERRORS.E403_2;
    return user;
  },
  buildLoginJwtForUser: (user) => buildLoginJwt(user),
  resolveSessionToken: async (token) => {
    const decoded = encryptationServices.validToken(token, TOKENS.SESSION);
    const userId = decoded.data.user.id;
    const user = await userRepositories.getOneByIdWithLoginInclude(userId);
    if (!user) throw ERRORS.E401_1;
    if (user.status !== STATUSES.ACTIVE) throw ERRORS.E403_2;
    return buildLoginJwt(user);
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
  recoverPassword: async ({ email }) => {
    const user = await userRepositories.getOneByEmail(email, USER_VARIANTS.EXISTS)
    if (!user) throw ERRORS.E404_1
    const token = encryptationServices.createToken({ id: user.id }, TOKENS.RECOVER_PASSWORD)
    const url = `${process.env.CORS_ORIGIN}/auth/reset-password?token=${token}`
    const mailContent = getTemplate(EMAIL_TEMPLATES.RECOVER_PASSWORD.key, { url })
    await sendMail(mailContent, email)
  },
  resetPassword: async ({ token, password }) => {
    const decoded = encryptationServices.validToken(token, TOKENS.RECOVER_PASSWORD)
    const tokenData = decoded.data
    const encryptedPassword = await encryptationServices.convertTextToHash(password)
    await userRepositories.editOneById(tokenData.id, { password: encryptedPassword })
  },
};

module.exports = authServices;
