const { Router } = require('express');
const studentsControllers = require('../controllers/students');
const authMiddlewares = require('../middlewares/auth');
const { USER_PERMISSIONS } = require('../../constants/userPermission');
const router = Router();

router.post('/', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), studentsControllers.create);
router.put('/:_id', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), studentsControllers.edit);
router.get('/', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), studentsControllers.getAll);
router.get('/:_id', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), studentsControllers.getOne);
router.delete('/:_id', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), studentsControllers.deleteOne);



module.exports = router;
