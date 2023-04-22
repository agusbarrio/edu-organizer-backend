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
      await authServices.logout({ token: req.cookies[TOKENS.SESSION.name] });
      res.clearCookie(TOKENS.SESSION.name)
      res.send('Logout')
    } catch (error) {
      next(error);
    }
  },


};

module.exports = authControllers;
