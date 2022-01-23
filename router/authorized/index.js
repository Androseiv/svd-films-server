const router = require('express').Router();

const userRoutes = require("./user-route");
const filmRoutes = require('./film-route')

router.use('/user', userRoutes);
router.use('/film', filmRoutes);

module.exports = router;