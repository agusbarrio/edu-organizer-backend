const { Router } = require('express');
const router = Router();

//routes
router.use('/test', require('./test'));
router.use('/auth', require('./auth'));
router.use('/courses', require('./courses'));

module.exports = router;
