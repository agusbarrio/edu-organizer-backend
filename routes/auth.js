const { Router } = require('express');
const authControllers = require('../controllers/auth');
const authOauthRouter = require('./auth.oauth');
const router = Router();

router.use(authOauthRouter);
router.get('/oauth/session', authControllers.oauthSession);
router.post('/login', authControllers.login);
router.get('/logout', authControllers.logout);
router.post('/course/:shortId/login', authControllers.courseLogin);
router.post('/recoverPassword', authControllers.recoverPassword);
router.put('/resetPassword', authControllers.resetPassword);
router.put('/completeAccount', authControllers.completeAccount);

module.exports = router;
