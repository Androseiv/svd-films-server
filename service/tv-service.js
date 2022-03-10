const db = require('../db/index')
const ApiError = require('../exceptions/api-error')

class TVService {
  later_tv = 'later_tv';
  favourite_tv = 'favourite_tv';
  rated_tv = 'rated_tv';

  async getFavouriteTV(user_id, page = 1, limit = 'ALL') {
    if(page < 1 || limit < 1) {
      throw ApiError.BadRequest('Invalid incoming data');
    }
    const offset = limit !== 'ALL' ? (page - 1) * limit : page-1;
    return (await db.query(`SELECT id, title, time FROM favourite_tv WHERE user_id = '${user_id}' LIMIT ${limit} OFFSET '${offset}'`));
  }

  async addFavouriteTV(tv_id, user_id, title) {
    const film = await this.isTVInTheTable(tv_id, user_id, this.favourite_tv);
    if(film) {
      throw ApiError.BadRequest('The film is already in the table')
    }
    return (await db.query(`INSERT INTO favourite_tv VALUES ('${tv_id}', '${title}', now(), '${user_id}') RETURNING *`))[0];
  }

  async removeFavouriteTV(tv_id, user_id) {
    return (await db.query(`DELETE FROM favourite_tv WHERE id = '${tv_id}' AND user_id = '${user_id}' RETURNING *`));
  }

  async getLaterTV(user_id, page = 1, limit = 'ALL') {
    if(page < 1 || limit < 1) {
      throw ApiError.BadRequest('Invalid incoming data');
    }
    const offset = limit !== 'ALL' ? (page - 1) * limit : page-1;
    return (await db.query(`SELECT id, title, time FROM later_tv WHERE user_id = '${user_id}' LIMIT ${limit} OFFSET '${offset}'`));
  }

  async addLaterTV(tv_id, user_id, title) {
    const film = await this.isTVInTheTable(tv_id, user_id, this.later_tv);
    if(film) {
      throw ApiError.BadRequest('The film is already in the table')
    }
    return (await db.query(`INSERT INTO later_tv VALUES ('${tv_id}', '${title}', now(),  '${user_id}') RETURNING *`))[0];
  }

  async removeLaterTV(tv_id, user_id) {
    return (await db.query(`DELETE FROM later_tv WHERE id = '${tv_id}' AND user_id = '${user_id}' RETURNING *`));
  }

  async getRatedTV(user_id, page = 1, limit = 'ALL') {
    if(page < 1 || limit < 1) {
      throw ApiError.BadRequest('Invalid incoming data');
    }
    const offset = limit !== 'ALL' ? (page - 1) * limit : page-1;
    return (await db.query(`SELECT id, title, time, rating FROM rated_tv WHERE user_id = '${user_id}' LIMIT ${limit} OFFSET '${offset}'`));
  }

  async addRatedTV(tv_id, rating, user_id, title) {
    const userRating = (await db.query(`SELECT * FROM rated_tv WHERE id = '${tv_id}' AND user_id = '${user_id}'`))[0];
    if(userRating) {
      return (await db.query(`UPDATE rated_tv SET rating = '${rating}' WHERE id = '${tv_id}' AND user_id = '${user_id}' RETURNING *`))[0];
    }
    return (await db.query(`INSERT INTO rated_tv VALUES ('${tv_id}', '${title}', now(), '${user_id}', '${rating}') RETURNING *`))[0];
  }

  async removeRatedTV(tv_id, user_id) {
    return (await db.query(`DELETE FROM rated_tv WHERE id = '${tv_id}' AND user_id = '${user_id}' RETURNING *`));
  }

  async isTVInTheTable (tv_id, user_id, table) {
    const film = (await db.query(`SELECT * FROM "${table}" WHERE id = '${tv_id}' AND user_id = ${user_id}`))[0];
    return Boolean(film);
  }

  async userTV (tv_id, user_id) {
    const isRated = await this.isTVInTheTable(tv_id, user_id, this.rated_tv);
    let rating;
    if(isRated) {
      rating = (await db.query(`SELECT rating FROM rated_tv WHERE id = '${tv_id}' AND user_id = '${user_id}'`))[0].rating
    }
    return {
      isLater: await this.isTVInTheTable(tv_id, user_id, this.later_tv),
      isFavourite: await this.isTVInTheTable(tv_id, user_id, this.favourite_tv),
      isRated,
      rating
    };
  }
}

module.exports = new TVService();