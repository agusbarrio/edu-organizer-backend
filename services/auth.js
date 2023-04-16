const authServices = {
  login: async (req, res, next) => {
    console.log('login');
  },
  register: async (req, res, next) => {
    console.log('register');
  },
  logout: async (req, res, next) => {
    console.log('logout');
  },
  recoverPassword: async (req, res, next) => {
    console.log('recoverPassword');
  },
};

module.exports = authServices;
