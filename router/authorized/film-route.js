const router = require('express').Router();
const FilmController = require("../../controllers/film-controller");


router.get('/:user_id/favourite/', FilmController.getFavouriteFilms);
router.post('/favourite/add', FilmController.addFavouriteFilm);
router.post('/favourite/remove', FilmController.removeFavouriteFilm);

router.get('/:user_id/later', FilmController.getLaterFilms);
router.post('/later/add', FilmController.addLaterFilm);
router.post('/later/remove', FilmController.removeLaterFilm);

router.get('/:user_id/rated', FilmController.getRatedFilms);
router.post('/rated/add', FilmController.addRatedFilm);
router.post('/rated/remove', FilmController.removeRatedFilm);

router.get('/info/:film_id/:user_id', FilmController.userFilm);

module.exports = router;