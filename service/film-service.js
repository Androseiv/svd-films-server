const db = require('../db/index')
const ApiError = require('../exceptions/api-error')

class FilmService {
  LATER_FILM = 'later_film';
  FAVOURITE_FILM = 'favourite_film';
  RATED_FILM = 'rated_film';

  async getFavouriteFilms(userId, page = 1, limit = 'ALL') {
    if(page < 1 || limit < 1) {
      throw ApiError.BadRequest('Invalid incoming data');
    }
    const offset = limit !== 'ALL' ? (page - 1) * limit : page-1;
    return (await db.query(`SELECT id, title, time FROM favourite_film WHERE user_id = '${userId}' LIMIT ${limit} OFFSET '${offset}'`));
  }

  async addFavouriteFilm(filmId, userId, filmTitle) {
    const film = await this.isFilmInTheTable(filmId, userId, this.FAVOURITE_FILM);
    if(film) {
      throw ApiError.BadRequest('The film is already in the table')
    }
    return (await db.query(`INSERT INTO favourite_film VALUES ('${filmId}', '${filmTitle}', now(), '${userId}') RETURNING *`))[0];
  }

  async removeFavouriteFilm(filmId, userId) {
    return (await db.query(`DELETE FROM favourite_film WHERE id = '${filmId}' AND user_id = '${userId}' RETURNING *`));
  }

  async getLaterFilms(userId, page = 1, limit = 'ALL') {
    if(page < 1 || limit < 1) {
      throw ApiError.BadRequest('Invalid incoming data');
    }
    const offset = limit !== 'ALL' ? (page - 1) * limit : page-1;
    return (await db.query(`SELECT id, title, time FROM later_film WHERE user_id = '${userId}' LIMIT ${limit} OFFSET '${offset}'`));
  }

  async addLaterFilm(filmId, userId, filmTitle) {
    const film = await this.isFilmInTheTable(filmId, userId, this.LATER_FILM);
    if(film) {
      throw ApiError.BadRequest('The film is already in the table')
    }
    return (await db.query(`INSERT INTO later_film VALUES ('${filmId}', '${filmTitle}', now(),  '${userId}') RETURNING *`))[0];
  }

  async removeLaterFilm(filmId, userId) {
    return (await db.query(`DELETE FROM later_film WHERE id = '${filmId}' AND user_id = '${userId}' RETURNING *`));
  }

  async getRatedFilms(userId, page = 1, limit = 'ALL') {
    if(page < 1 || limit < 1) {
      throw ApiError.BadRequest('Invalid incoming data');
    }
    const offset = limit !== 'ALL' ? (page - 1) * limit : page-1;
    return (await db.query(`SELECT id, title, time, rating FROM rated_film WHERE user_id = '${userId}' LIMIT ${limit} OFFSET '${offset}'`));
  }

  async addRatedFilm(filmId, rating, userId, filmTitle) {
    const userRating = (await db.query(`SELECT * FROM rated_film WHERE id = '${filmId}' AND user_id = '${userId}'`))[0];
    if(userRating) {
      return (await db.query(`UPDATE rated_film SET rating = '${rating}' WHERE id = '${filmId}' AND user_id = '${userId}' RETURNING *`))[0];
    }
    return (await db.query(`INSERT INTO rated_film VALUES ('${filmId}', '${filmTitle}', now(), '${userId}', '${rating}') RETURNING *`))[0];
  }

  async removeRatedFilm(filmId, userId) {
    return (await db.query(`DELETE FROM rated_film WHERE id = '${filmId}' AND user_id = '${userId}' RETURNING *`));
  }

  async isFilmInTheTable (filmId, userId, table) {
    const film = (await db.query(`SELECT * FROM "${table}" WHERE id = '${filmId}' AND user_id = ${userId}`))[0];
    return Boolean(film);
  }

  async userFilm (filmId, userId) {
    const isRated = await this.isFilmInTheTable(filmId, userId, this.RATED_FILM);
    let rating;
    if(isRated) {
       rating = (await db.query(`SELECT rating FROM rated_film WHERE id = '${filmId}' AND user_id = '${userId}'`))[0].rating
    }
    return {
      isLater: await this.isFilmInTheTable(filmId, userId, this.RATED_FILM),
      isFavourite: await this.isFilmInTheTable(filmId, userId, this.FAVOURITE_FILM),
      isRated,
      rating
    };
  }
}

module.exports = new FilmService();