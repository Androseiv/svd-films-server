const FilmService = require('../service/film-service')

class FilmController {
  async getFavouriteFilms(req, res, next) {
    try {
      const {userId} = req.params;
      const {page, limit} = req.query;
      const films = await FilmService.getFavouriteFilms(userId, page, limit);
      return res.json(films);
    } catch (err) {
      next(err);
    }
  }

  async addFavouriteFilm(req, res, next) {
    try {
      const {film_id, title} = req.body;
      const {refreshToken} = req.cookies;
      const film = await FilmService.addFavouriteFilm(film_id, refreshToken, title);
      return res.json(film);
    } catch (err) {
      next(err);
    }
  }

  async removeFavouriteFilm(req, res, next) {
    try {
      const {film_id} = req.body;
      const {refreshToken} = req.cookies;
      const film = await FilmService.removeFavouriteFilm(film_id, refreshToken);
      return res.json(film);
    } catch (err) {
      next(err);
    }
  }

  async getLaterFilms(req, res, next) {
    try {
      const {userId} = req.params;
      const {page, limit} = req.query;
      const films = await FilmService.getLaterFilms(userId, page, limit);
      return res.json(films);
    } catch (err) {
      next(err);
    }
  }

  async addLaterFilm(req, res, next) {
    try {
      const {film_id, title} = req.body;
      const {refreshToken} = req.cookies;
      const film = await FilmService.addLaterFilm(film_id, refreshToken, title);
      return res.json(film);
    } catch (err) {
      next(err);
    }
  }

  async removeLaterFilm(req, res, next) {
    try {
      const {film_id} = req.body;
      const {refreshToken} = req.cookies;
      const film = await FilmService.removeLaterFilm(film_id, refreshToken);
      return res.json(film);
    } catch (err) {
      next(err);
    }
  }

  async getRatedFilms(req, res, next) {
    try {
      const {userId} = req.params;
      const {page, limit} = req.query;
      const films = await FilmService.getRatedFilms(userId, page, limit);
      return res.json(films);
    } catch (err) {
      next(err);
    }
  }

  async addRatedFilm(req, res, next) {
    try {
      const {film_id, rating, title} = req.body;
      const {refreshToken} = req.cookies;
      const film = await FilmService.addRatedFilm(film_id, rating, refreshToken, title);
      return res.json(film);
    } catch (err) {
      next(err);
    }
  }

  async removeRatedFilm(req, res, next) {
    try {
      const {film_id} = req.body;
      const {refreshToken} = req.cookies;
      const film = await FilmService.removeRatedFilm(film_id, refreshToken);
      return res.json(film);
    } catch (err) {
      next(err);
    }
  }

  async userFilm(req, res, next) {
    try {
      const {filmId} = req.params;
      const {refreshToken} = req.cookies;
      const data = await FilmService.userFilm(filmId, refreshToken);
      return res.json(data);
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new FilmController();