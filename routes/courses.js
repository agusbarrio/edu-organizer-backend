const { Router } = require('express');
const courseControllers = require('../controllers/course');
const authMiddlewares = require('../middlewares/auth');
const { USER_PERMISSIONS } = require('../constants/userPermission');
const router = Router();

router.post('/', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), courseControllers.create);
router.put('/:id', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), courseControllers.edit);
router.get('/', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), courseControllers.getAll);
router.delete('/:id', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), courseControllers.deleteOne);

module.exports = router;
