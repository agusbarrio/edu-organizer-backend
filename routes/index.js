const { Router } = require('express');
const router = Router();

//routes
router.use('/test', require('./test'));
router.use('/auth', require('./auth'));

module.exports = router;
