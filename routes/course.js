const { Router } = require('express');
const authMiddlewares = require('../middlewares/auth');
const courseControllers = require('../controllers/course');

const router = Router();

router.get('/', authMiddlewares.courseAccess, courseControllers.get);
router.get('/students', authMiddlewares.courseAccess, courseControllers.getStudents);
router.post('/newClass', authMiddlewares.courseAccess, courseControllers.newClass);
router.post('/students', authMiddlewares.courseAccess, courseControllers.createStudent);
router.get('/classSessions', authMiddlewares.courseAccess, courseControllers.getClassSessions);
router.delete('/classSessions/:id', authMiddlewares.courseAccess, courseControllers.deleteClassSession);
router.get('/classSessions/:id', authMiddlewares.courseAccess, courseControllers.getClassSession);
router.put('/classSessions/:id', authMiddlewares.courseAccess, courseControllers.editClassSession);

module.exports = router;
