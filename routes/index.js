const { Router } = require('express');
const router = Router();

//routes
router.use('/test', require('./test'));
router.use('/auth', require('./auth'));
router.use('/courses', require('./courses'));
router.use('/course', require('./course'));
router.use('/students', require('./students'));
router.use('/users', require('./users'));
router.use('/organizations', require('./organizations'));
router.use('/organization', require('./organization'));

module.exports = router;
