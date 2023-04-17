const authServices = require('../services/auth');
const validator = require('../services/validator');
const authControllers = {
  login: async (req, res, next) => {
    try {
      const result = await authServices.login(req, res, next);
      res.send(result);
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
      const result = await authServices.logout(req, res, next);
      res.send(result);
    } catch (error) {
      next(error);
    }
  },

  recoverPassword: async (req, res, next) => {
    try {
      const result = await authServices.recoverPassword(req, res, next);
      res.send(result);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authControllers;
