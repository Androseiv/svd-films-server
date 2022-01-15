const UserController = require('../controllers/UserController')
const FilmController = require('../controllers/FilmController')
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware')

const router = require('express').Router();


router.post('/registration',
  body('email').isEmail(),
  body('password').isLength({min: 5, max: 32}),
  UserController.registration
);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/activate/:link', UserController.activate);
router.get('/refresh', UserController.refresh);

router.get('/:userId/films/favourite/', FilmController.getFavouriteFilms);
router.post('/films/favourite/add', authMiddleware, FilmController.addFavouriteFilm);
router.post('/films/favourite/remove', authMiddleware, FilmController.removeFavouriteFilm);

router.get('/:userId/films/later', FilmController.getLaterFilms);
router.post('/films/later/add', authMiddleware, FilmController.addLaterFilm);
router.post('/films/later/remove', authMiddleware, FilmController.removeLaterFilm);

router.get('/:userId/films/rated', FilmController.getRatedFilms);
router.post('/films/rated/add', authMiddleware, FilmController.addRatedFilm);
router.post('/films/rated/remove', authMiddleware, FilmController.removeRatedFilm);

router.get('/info/:filmId', authMiddleware, FilmController.userFilm);

module.exports = router;
