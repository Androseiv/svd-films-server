const router = require('express').Router();
const TVController = require("../../controllers/tv-controller");


router.get('/:user_id/favourite/', TVController.getFavouriteTVs);
router.post('/favourite/add', TVController.addFavouriteTV);
router.post('/favourite/remove', TVController.removeFavouriteTV);

router.get('/:user_id/later', TVController.getLaterTVs);
router.post('/later/add', TVController.addLaterTV);
router.post('/later/remove', TVController.removeLaterTV);

router.get('/:user_id/rated', TVController.getRatedTVs);
router.post('/rated/add', TVController.addRatedTV);
router.post('/rated/remove', TVController.removeRatedTV);

router.get('/info/:film_id/:user_id', TVController.userTV);

module.exports = router;