const router = require('express').Router();

const userRoutes = require("./user-route");
const filmRoutes = require('./film-route');
const tvRoutes = require('./tv-route')


router.use('/user', userRoutes);
router.use('/film', filmRoutes);
router.use('/tv', tvRoutes);

module.exports = router;