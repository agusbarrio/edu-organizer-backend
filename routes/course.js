const { Router } = require('express');
const authMiddlewares = require('../middlewares/auth');
const courseControllers = require('../controllers/course');

const router = Router();

router.get('/', authMiddlewares.courseAccess, courseControllers.get);
router.get('/students', authMiddlewares.courseAccess, courseControllers.getStudents);
router.post('/newClass', authMiddlewares.courseAccess, courseControllers.newClass);
router.post('/students', authMiddlewares.courseAccess, courseControllers.createStudent);

module.exports = router;
