const { Router } = require('express');
const studentControllers = require('../controllers/student');
const authMiddlewares = require('../middlewares/auth');
const { USER_PERMISSIONS } = require('../constants/userPermission');
const router = Router();

router.post('/', authMiddlewares.canAccess([USER_PERMISSIONS.ADMIN]), studentControllers.create);
router.put('/:id', authMiddlewares.canAccess([USER_PERMISSIONS.ADMIN]), studentControllers.edit);
router.get('/', authMiddlewares.canAccess([USER_PERMISSIONS.ADMIN]), studentControllers.getAll);
router.delete('/:id', authMiddlewares.canAccess([USER_PERMISSIONS.ADMIN]), studentControllers.deleteOne);



module.exports = router;
