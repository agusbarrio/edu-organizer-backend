const { Router } = require('express');
const usersControllers = require('../controllers/users');
const authMiddlewares = require('../middlewares/auth');
const { USER_PERMISSIONS } = require('../constants/userPermission');
const router = Router();

router.get('/', authMiddlewares.userAccess([USER_PERMISSIONS.SUPERADMIN]), usersControllers.getAll);
router.get('/organization', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), usersControllers.getAllByOrganization);
router.post('/organization', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), usersControllers.createByOrganization);
router.delete('/:id/organization', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), usersControllers.deleteByOrganization);
router.post('/:id/organization/resendInvitation', authMiddlewares.userAccess([USER_PERMISSIONS.ADMIN]), usersControllers.resendInvitationByOrganization);



module.exports = router;
