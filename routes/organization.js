const { Router } = require('express');
const organizationControllers = require('../controllers/organization');
const authMiddlewares = require('../middlewares/auth');
const { USER_PERMISSIONS } = require('../constants/userPermission');
const router = Router();

router.get('/', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), organizationControllers.getMyOrganization);
router.put('/', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), organizationControllers.editMyOrganization);



module.exports = router;
