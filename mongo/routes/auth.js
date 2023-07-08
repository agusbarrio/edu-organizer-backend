const { Router } = require('express');
const authControllers = require('../controllers/auth');
const router = Router();

router.post('/register', authControllers.register);
router.post('/login', authControllers.login);
router.get('/logout', authControllers.logout);
router.post('/course/:shortId/login', authControllers.courseLogin);
router.get('/verifySession', authControllers.verifySession);
router.get('/verifySessionCourse', authControllers.verifySessionCourse);
router.put('/verifyAccount', authControllers.verifyAccount);
router.post('/recoverPassword', authControllers.recoverPassword);
router.put('/resetPassword', authControllers.resetPassword);

module.exports = router;
