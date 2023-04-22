const { Router } = require('express');
const authControllers = require('../controllers/auth');
const router = Router();

router.post('/register', authControllers.register);

router.post('/login', authControllers.login);

router.get('/logout', authControllers.logout);

router.post('/recoverPassword', authControllers.recoverPassword);

module.exports = router;
