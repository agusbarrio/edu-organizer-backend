const { Router } = require('express');
const usersControllers = require('../controllers/users');
const authMiddlewares = require('../middlewares/auth');
const { USER_PERMISSIONS } = require('../../constants/userPermission');
const router = Router();

router.get('/', authMiddlewares.userAccess([USER_PERMISSIONS.SUPERADMIN]), usersControllers.getAll);



module.exports = router;
