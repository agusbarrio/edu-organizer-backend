const { Router } = require('express');
const authMiddlewares = require('../middlewares/auth');
const { USER_PERMISSIONS } = require('../../constants/userPermission');
const coursesControllers = require('../controllers/courses');
const router = Router();

router.post('/', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), coursesControllers.create);
router.put('/:_id', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), coursesControllers.edit);
router.put('/', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), coursesControllers.editMultiple);
router.get('/', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), coursesControllers.getAll);
router.get('/:_id', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), coursesControllers.getOne);
router.delete('/:_id', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), coursesControllers.deleteOne);
router.delete('/', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), coursesControllers.deleteMultiple);

module.exports = router;
