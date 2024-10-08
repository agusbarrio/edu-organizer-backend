const { Router } = require('express');
const authMiddlewares = require('../middlewares/auth');
const { USER_PERMISSIONS } = require('../constants/userPermission');
const coursesControllers = require('../controllers/courses');
const router = Router();

router.post('/', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), coursesControllers.create);
router.put('/:id', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), coursesControllers.edit);
router.put('/', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), coursesControllers.editMultiple);
router.get('/', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), coursesControllers.getAll);
router.get('/:id', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), coursesControllers.getOne);
router.get('/:id/xlsx', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), coursesControllers.getXlsxCourse);
router.delete('/:id', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), coursesControllers.deleteOne);
router.delete('/', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), coursesControllers.deleteMultiple);

module.exports = router;
