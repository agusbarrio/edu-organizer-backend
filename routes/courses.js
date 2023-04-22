const { Router } = require('express');
const courseControllers = require('../controllers/course');
const authMiddlewares = require('../middlewares/auth');
const { USER_PERMISSIONS } = require('../constants/userPermission');
const router = Router();

router.post('/', authMiddlewares.canAccess([USER_PERMISSIONS.ADMIN]), courseControllers.create);
router.put('/:id', authMiddlewares.canAccess([USER_PERMISSIONS.ADMIN]), courseControllers.edit);
router.get('/', authMiddlewares.canAccess([USER_PERMISSIONS.ADMIN]), courseControllers.getAll);
router.delete('/:id', authMiddlewares.canAccess([USER_PERMISSIONS.ADMIN]), courseControllers.deleteOne);



module.exports = router;
