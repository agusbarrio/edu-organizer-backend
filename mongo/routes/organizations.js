const { Router } = require('express');
const organizationsControllers = require('../controllers/organizations');
const authMiddlewares = require('../middlewares/auth');
const { USER_PERMISSIONS } = require('../../constants/userPermission');
const router = Router();

router.get('/', authMiddlewares.userAccess([USER_PERMISSIONS.SUPERADMIN]), organizationsControllers.getAll);
router.delete('/:_id', authMiddlewares.userAccess([USER_PERMISSIONS.SUPERADMIN]), organizationsControllers.deleteOne);



module.exports = router;
