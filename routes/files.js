const { Router } = require('express');
const filesControllers = require('../controllers/files');
const authMiddlewares = require('../middlewares/auth');
const { USER_PERMISSIONS } = require('../constants/userPermission');
const filesMiddlewares = require('../middlewares/files');
const router = Router();

router.post('/singleImage', authMiddlewares.courseOrUserAccess([USER_PERMISSIONS.ADMIN]), filesMiddlewares.uploadSingle(filesMiddlewares.filterImage), filesControllers.createOne);

module.exports = router;
