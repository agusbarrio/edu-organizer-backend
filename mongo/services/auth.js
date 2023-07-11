
const { TOKENS } = require('../../constants/auth');
const EMAIL_TEMPLATES = require('../../constants/emailTemplates');
const ERRORS = require('../../constants/errors');
const { STATUSES } = require('../../constants/user');
const { USER_PERMISSIONS } = require('../../constants/userPermission');
const Course = require('../models/course');
const Organization = require('../models/organization');
const User = require('../models/user');

const { sendMail, getTemplate } = require('./emailNotifications');
const encryptationServices = require('./encryptation');

let isFirstUser

const authServices = {
  login: async ({ email, password }) => {
    const user =
      await User.findOne({ email }).select('_id firstName lastName email permissions status password').populate({ path: 'organization', select: '_id name' })
    if (!user) throw ERRORS.E401_1;
    if (user.status !== STATUSES.ACTIVE) throw ERRORS.E403_2;
    const isValidPassword = await encryptationServices.compareTextWithHash(password, user.password)
    if (!isValidPassword) throw ERRORS.E401_1;
    const result = user.toJSON()
    delete result.password
    const token = encryptationServices.createToken({
      user: result,
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
  }) => {
    const userExists = await User.findOne({ email })
    if (userExists) throw ERRORS.E409_1;
    const newOrganization = await Organization.create({ name: organizationName });
    const encryptedPassword = await encryptationServices.convertTextToHash(password);
    const permissions = [USER_PERMISSIONS.ADMIN, USER_PERMISSIONS.TEACHER, USER_PERMISSIONS.OWNER]
    if (isFirstUser) permissions.push(USER_PERMISSIONS.SUPERADMIN)
    const user = await User.create(
      {
        email,
        password: encryptedPassword,
        status,
        firstName,
        lastName,
        organization: newOrganization._id,
        permissions
      });
    await Organization.updateOne({ _id: newOrganization._id }, { $push: { users: user._id } })
    return user;
  },
  register: async ({
    email,
    password,
    firstName,
    lastName,
    organizationName,
  }) => {
    if (typeof isFirstUser === 'undefined') {
      const usersCount = await User.countDocuments()
      isFirstUser = usersCount === 0
    }
    const user = await authServices.registerOrganization({
      email,
      password,
      firstName,
      lastName,
      organizationName,
      status: STATUSES.PENDING
    });
    const userObject = user.toJSON()
    delete userObject.password
    const token = encryptationServices.createToken({ user: userObject }, TOKENS.VERIFY_ACCOUNT)
    const url = `${process.env.CORS_ORIGIN}/auth/verify-account?token=${token}`
    const mailContent = getTemplate(EMAIL_TEMPLATES.VERIFY_ACCOUNT.key, { url })
    await sendMail(mailContent, user.email)
    return { token }
  },
  verifyAccount: async ({ token }) => {
    const decoded = encryptationServices.validToken(token, TOKENS.VERIFY_ACCOUNT)
    const tokenData = decoded.data
    await User.updateOne({ _id: tokenData.user._id }, { status: STATUSES.ACTIVE })
  },

  logout: async ({ sessionToken, courseToken }) => {
    //TODO invalidar token de sesión
    //TODO invalidar token de curso
  },
  validUserAccess: async ({ token, permissions: availablePermissions = [] }) => {
    const decoded = encryptationServices.validToken(token, TOKENS.SESSION)
    const tokenData = decoded.data
    const currentPermissions = tokenData.user.permissions
    if (availablePermissions.some((availablePermissions) => !currentPermissions.includes(availablePermissions))) throw ERRORS.E403
    const context = tokenData
    return context
  },
  validCourseAccess: async ({ token }) => {
    const decoded = encryptationServices.validToken(token, TOKENS.COURSE)
    const tokenData = decoded.data
    const context = tokenData
    return context
  },
  courseLogin: async ({ accessPin, _id }) => {
    const course = await Course.findById(_id).select('_id name accessPin iv').populate({ path: 'organization', select: '_id name' })
    if (!course) throw ERRORS.E404_2
    if (!course?.accessPin || !course?.iv) throw ERRORS.E401_1
    const decryptedAccessPin = encryptationServices.decrypt({ encryptedData: course.accessPin, iv: course.iv })
    if (decryptedAccessPin !== accessPin) throw ERRORS.E401_1
    const result = course.toJSON()
    delete result.accessPin
    delete result.iv
    const token = encryptationServices.createToken({ course: result }, TOKENS.COURSE)
    return { token, course: result }
  },
  recoverPassword: async ({ email }) => {
    const user = await User.findOne({ email }).populate({ path: 'organization', select: '_id name' })
    if (!user) throw ERRORS.E404_1
    const result = user.toJSON()
    delete result.password
    const token = encryptationServices.createToken({ user }, TOKENS.RECOVER_PASSWORD)
    const url = `${process.env.CORS_ORIGIN}/auth/reset-password?token=${token}`
    const mailContent = getTemplate(EMAIL_TEMPLATES.RECOVER_PASSWORD.key, { url })
    await sendMail(mailContent, email)
  },
  resetPassword: async ({ token, password }) => {
    const decoded = encryptationServices.validToken(token, TOKENS.RECOVER_PASSWORD)
    const tokenData = decoded.data
    const encryptedPassword = await encryptationServices.convertTextToHash(password)
    await User.updateOne({ _id: tokenData.user._id }, { password: encryptedPassword })
  },
};


module.exports = authServices;
