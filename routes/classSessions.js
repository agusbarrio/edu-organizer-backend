const { Router } = require('express');
const classSessionsControllers = require('../controllers/classSessions');
const authMiddlewares = require('../middlewares/auth');
const { USER_PERMISSIONS } = require('../constants/userPermission');
const router = Router();

// router.post('/', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), classSessionsControllers.create);
router.put('/:id', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), classSessionsControllers.edit);
router.get('/', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), classSessionsControllers.getAll);
router.get('/:id', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), classSessionsControllers.getOne);
router.delete('/:id', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), classSessionsControllers.deleteOne);



module.exports = router;
