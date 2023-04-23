const { TOKENS } = require('../constants/auth');
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
      const { token } = await authServices.login({ email, password });
      res.cookie(TOKENS.SESSION.name, token)
      res.send('Logged')
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
      const { email, password, firstName, lastName, organizationName } =
        await validator.validate(schema, req.body);
      await authServices.register({
        email,
        password,
        firstName,
        lastName,
        organizationName,
      });
      res.send('Registered');
    } catch (error) {
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try {
      await authServices.logout({ sessionToken: req.cookies[TOKENS.SESSION.name], courseToken: req.cookies[TOKENS.COURSE_SESSION.name] })
      res.clearCookie(TOKENS.SESSION.name)
      res.clearCookie(TOKENS.COURSE_SESSION.name)
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
      const { token } = await authServices.courseLogin({ accessPin, shortId });
      res.cookie(TOKENS.COURSE_SESSION.name, token);
      res.send('Course logged');
    } catch (error) {
      next(error)
    }
  },
};

module.exports = authControllers;
