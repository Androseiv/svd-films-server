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
      const {tv_id, user_id} = req.body;
      const tv = await TVService.addFavouriteTV(tv_id, user_id);
      return res.json(tv);
    } catch (err) {
      next(err);
    }
  }

  async removeFavouriteTV(req, res, next) {
    try {
      const {tv_id, user_id} = req.body;
      const tv = await TVService.removeFavouriteTV(tv_id, user_id);
      return res.json(tv);
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
      const {tv_id, title, user_id} = req.body;
      const tv = await TVService.addLaterTV(tv_id, user_id, title);
      return res.json(tv);
    } catch (err) {
      next(err);
    }
  }

  async removeLaterTV(req, res, next) {
    try {
      const {tv_id, user_id} = req.body;
      const tv = await TVService.removeLaterTV(tv_id, user_id);
      return res.json(tv);
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
      const {tv_id, rating, title, user_id} = req.body;
      const tv = await TVService.addRatedTV(tv_id, rating, user_id, title);
      return res.json(tv);
    } catch (err) {
      next(err);
    }
  }

  async removeRatedTV(req, res, next) {
    try {
      const {tv_id, user_id} = req.body;
      const tv = await TVService.removeRatedTV(tv_id, user_id);
      return res.json(tv);
    } catch (err) {
      next(err);
    }
  }

  async userTV(req, res, next) {
    try {
      const {tv_id, user_id} = req.params;
      const data = await TVService.userTV(tv_id, user_id);
      return res.json(data);
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new TVController();