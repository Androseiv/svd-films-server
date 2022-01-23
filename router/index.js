const authMiddleware = require('../middlewares/auth-middleware')
const AuthorizedRoutes = require('./authorized/index')
const unAuthorizedRoutes = require('./unauthorized/index')

const router = require('express').Router();

router.use('/authorized',authMiddleware, AuthorizedRoutes);
router.use('/unauthorized', unAuthorizedRoutes);

module.exports = router;
