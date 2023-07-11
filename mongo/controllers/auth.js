const { TOKENS } = require('../../constants/auth');
const authServices = require('../services/auth');
const validator = require('../services/validator');
const authControllers = {
  login: async (req, res, next) => {
    try {
      const schema = validator.createSchema({
        email: validator.email(),
        password: validator.text({ required: { value: true } })
      })
      const { email, password } = await validator.validate(schema, req.body)
      const { token, user } = await authServices.login({ email, password });
      res.cookie(TOKENS.SESSION, token);
      res.json(user)
    } catch (error) {
      next(error);
    }
  },
  register: async (req, res, next) => {
    try {
      const schema = validator.createSchema({
        email: validator.email(),
        password: validator.password(),
        firstName: validator.text({ required: { value: true } }),
        lastName: validator.text({ required: { value: true } }),
        organizationName: validator.text({ required: { value: true } }),
      });
      const { email, password, firstName, lastName, organizationName } = await validator.validate(schema, req.body);
      const { token } = await authServices.register({
        email,
        password,
        firstName,
        lastName,
        organizationName,
      });
      res.json({ token });
    } catch (error) {
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      await authServices.logout({ sessionToken: req.cookies[TOKENS.SESSION], courseToken: req.cookies[TOKENS.COURSE] })
      res.clearCookie(TOKENS.SESSION)
      res.clearCookie(TOKENS.COURSE)
      res.send('Logout')
    } catch (error) {
      next(error);
    }
  },
  courseLogin: async (req, res, next) => {
    try {
      const schema = validator.createSchema({
        accessPin: validator.text({ required: { value: true } }),
        _id: validator._id(),
      });
      const { accessPin, _id } = await validator.validate(schema, { accessPin: req.body.accessPin, _id: req.params._id });
      const { token, course } = await authServices.courseLogin({ accessPin, _id });
      res.cookie(TOKENS.COURSE, token);
      res.send(course);
    } catch (error) {
      next(error)
    }
  },
  verifySession: async (req, res, next) => {
    try {
      const userSession = await authServices.validUserAccess({ token: req.cookies[TOKENS.SESSION] })
      res.json(userSession)
    } catch (error) {
      res.clearCookie(TOKENS.SESSION)
      next(error)
    }
  },
  verifySessionCourse: async (req, res, next) => {
    try {
      const courseSession = await authServices.validCourseAccess({ token: req.cookies[TOKENS.COURSE] })
      res.json(courseSession)
    } catch (error) {
      res.clearCookie(TOKENS.COURSE)
      next(error)
    }
  },
  verifyAccount: async (req, res, next) => {
    try {
      const schema = validator.createSchema({
        token: validator.token(),
      });
      const { token } = await validator.validate(schema, req.body);
      await authServices.verifyAccount({ token });
      res.send('Account verified');
    } catch (error) {
      next(error);
    }
  },
  recoverPassword: async (req, res, next) => {
    try {
      const schema = validator.createSchema({
        email: validator.email(),
      });
      const { email } = await validator.validate(schema, req.body);
      await authServices.recoverPassword({ email });
      res.send('Password recovery email sent');
    } catch (error) {
      next(error);
    }
  },
  resetPassword: async (req, res, next) => {
    try {
      const schema = validator.createSchema({
        token: validator.token(),
        password: validator.password(),
      });
      const { token, password } = await validator.validate(schema, req.body);
      await authServices.resetPassword({ token, password });
      res.send('Password reset');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authControllers;
