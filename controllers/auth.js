const ERRORS = require('../constants/errors');
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
      const { token, user } = await authServices.login({ email, password })
      res.json({ user, token })
    } catch (error) {
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      await authServices.logout({ sessionToken: req.userToken, courseToken: req.courseToken })
      res.send('Logout')
    } catch (error) {
      next(error);
    }
  },
  courseLogin: async (req, res, next) => {
    try {
      const schema = validator.createSchema({
        accessPin: validator.text({ required: { value: true } }),
        shortId: validator.text({ required: { value: true } }),
      });
      const { accessPin, shortId } = await validator.validate(schema, { accessPin: req.body.accessPin, shortId: req.params.shortId });
      const { token, course } = await authServices.courseLogin({ accessPin, shortId });
      res.json({ course, token });
    } catch (error) {
      next(error)
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
        token: validator.token({ required: { value: true } }),
        password: validator.password(),
      });
      const { token, password } = await validator.validate(schema, req.body);
      await authServices.resetPassword({ token, password });
      res.send('Password reset');
    } catch (error) {
      next(error);
    }
  },
  completeAccount: async (req, res, next) => {
    try {
      const schema = validator.createSchema({
        token: validator.token({ required: { value: true } }),
        firstName: validator.name({ required: { value: true } }),
        lastName: validator.name({ required: { value: true } }),
        password: validator.password(),
      });
      const { token, firstName, lastName, password } = await validator.validate(schema, req.body);
      await authServices.completeAccount({ token, firstName, lastName, password });
      res.send('Account completed');
    } catch (error) {
      next(error);
    }
  },
  oauthSession: async (req, res, next) => {
    try {
      const header = req.headers['user-authorization'];
      const token = header?.split(' ')[1];
      if (!token) throw ERRORS.E401;
      const payload = await authServices.resolveSessionToken(token);
      res.json(payload);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authControllers;
