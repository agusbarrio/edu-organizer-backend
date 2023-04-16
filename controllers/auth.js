const authServices = require('../services/auth');

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
      await authServices.register(req, res, next);
      res.send('registered');
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
