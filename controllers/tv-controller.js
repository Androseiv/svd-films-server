const TVService = require('../service/tv-service')

class TVController {
  async getFavouriteTVs(req, res, next) {
    try {
      const {user_id} = req.params;
      const {page, limit} = req.query;
      const TVs = await TVService.getFavouriteTV(user_id, page, limit);
      return res.json(TVs);
    } catch (err) {
      next(err);
    }
  }

  async addFavouriteTV(req, res, next) {
    try {
      const {film_id, title, user_id} = req.body;
      const film = await TVService.addFavouriteTV(film_id, user_id, title);
      return res.json(film);
    } catch (err) {
      next(err);
    }
  }

  async removeFavouriteTV(req, res, next) {
    try {
      const {film_id, user_id} = req.body;
      const film = await TVService.removeFavouriteTV(film_id, user_id);
      return res.json(film);
    } catch (err) {
      next(err);
    }
  }

  async getLaterTVs(req, res, next) {
    try {
      const {user_id} = req.params;
      const {page, limit} = req.query;
      const TVs = await TVService.getLaterTV(user_id, page, limit);
      return res.json(TVs);
    } catch (err) {
      next(err);
    }
  }

  async addLaterTV(req, res, next) {
    try {
      const {film_id, title, user_id} = req.body;
      const film = await TVService.addLaterTV(film_id, user_id, title);
      return res.json(film);
    } catch (err) {
      next(err);
    }
  }

  async removeLaterTV(req, res, next) {
    try {
      const {film_id, user_id} = req.body;
      const film = await TVService.removeLaterTV(film_id, user_id);
      return res.json(film);
    } catch (err) {
      next(err);
    }
  }

  async getRatedTVs(req, res, next) {
    try {
      const {user_id} = req.params;
      const {page, limit} = req.query;
      const TVs = await TVService.getRatedTV(user_id, page, limit);
      return res.json(TVs);
    } catch (err) {
      next(err);
    }
  }

  async addRatedTV(req, res, next) {
    try {
      const {film_id, rating, title, user_id} = req.body;
      const film = await TVService.addRatedTV(film_id, rating, user_id, title);
      return res.json(film);
    } catch (err) {
      next(err);
    }
  }

  async removeRatedTV(req, res, next) {
    try {
      const {film_id, user_id} = req.body;
      const film = await TVService.removeRatedTV(film_id, user_id);
      return res.json(film);
    } catch (err) {
      next(err);
    }
  }

  async userTV(req, res, next) {
    try {
      const {film_id, user_id} = req.params;
      const data = await TVService.userTV(film_id, user_id);
      return res.json(data);
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new TVController();