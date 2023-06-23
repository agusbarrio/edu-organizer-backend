const { Router } = require('express');
const userControllers = require('../controllers/user');
const authMiddlewares = require('../middlewares/auth');
const router = Router();

router.get('/', authMiddlewares.userAccess(), userControllers.getMyUser);
router.put('/', authMiddlewares.userAccess(), userControllers.editMyUser);



module.exports = router;
