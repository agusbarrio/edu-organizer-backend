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
router.use('/user', require('./user'));
router.use('/classSessions', require('./classSessions'));
router.use('/files', require('./files'));

module.exports = router;
