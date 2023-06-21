const { Router } = require('express');
const usersControllers = require('../controllers/users');
const authMiddlewares = require('../middlewares/auth');
const { USER_PERMISSIONS } = require('../constants/userPermission');
const router = Router();

router.put('/:id/allowRegistration', authMiddlewares.userAccess([USER_PERMISSIONS.SUPERADMIN]), usersControllers.allowRegistration);
router.put('/:id/denyRegistration', authMiddlewares.userAccess([USER_PERMISSIONS.SUPERADMIN]), usersControllers.denyRegistration);
router.get('/', authMiddlewares.userAccess([USER_PERMISSIONS.SUPERADMIN]), usersControllers.getAll);



module.exports = router;
