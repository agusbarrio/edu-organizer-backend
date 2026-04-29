'use strict';

const { Router } = require('express');
const authMiddlewares = require('../middlewares/auth');
const { teacherCourseAccess } = require('../middlewares/teacherCourse');
const { USER_PERMISSIONS } = require('../constants/userPermission');
const teacherCourseControllers = require('../controllers/teacherCourse');

const router = Router();

const teacherOnly = [USER_PERMISSIONS.TEACHER];

router.get(
  '/',
  authMiddlewares.userAccess(teacherOnly),
  teacherCourseControllers.listCourses
);

const scoped = Router({ mergeParams: true });
scoped.use(teacherCourseAccess);

scoped.get('/', teacherCourseControllers.getCourse);
scoped.get('/students', teacherCourseControllers.getStudents);
scoped.get('/students/:id', teacherCourseControllers.getStudent);
scoped.post('/students', teacherCourseControllers.createStudent);
scoped.put('/students/:id', teacherCourseControllers.editStudent);
scoped.post('/newClass', teacherCourseControllers.newClass);
scoped.get('/classSessions', teacherCourseControllers.getClassSessions);
scoped.get('/classSessions/:id', teacherCourseControllers.getClassSession);
scoped.put('/classSessions/:id', teacherCourseControllers.editClassSession);
scoped.delete('/classSessions/:id', teacherCourseControllers.deleteClassSession);

router.use('/:courseId', authMiddlewares.userAccess(teacherOnly), scoped);

module.exports = router;
