const db = require('../db/index')
const ApiError = require('../exceptions/api-error')
const UserService = require('../service/user-service')

class FilmService {
  async getFavouriteFilms(userId, page = 1, limit = 'ALL') {
    if(page < 1 || limit < 1) {
      throw ApiError.BadRequest('Invalid incoming data');
    }
    const offset = limit !== 'ALL' ? (page - 1) * limit : page-1;
    return (await db.query(`SELECT * FROM favourite_film WHERE user_id = '${userId}' LIMIT ${limit} OFFSET '${offset}'`));
  }

  async addFavouriteFilm(filmId, refreshToken) {
    const userId = await UserService.getUserIdByToken(refreshToken);
    const film = await this.isFilmInTheTable(filmId, userId, 'later_film');
    if(film) {
      throw ApiError.BadRequest('The film is already in the table')
    }
    return (await db.query(`INSERT INTO favourite_film VALUES ('${filmId}', '${userId}') RETURNING *`))[0];
  }

  async removeFavouriteFilm(filmId, refreshToken) {
    const userId = await UserService.getUserIdByToken(refreshToken);
    return (await db.query(`DELETE FROM favourite_film WHERE id = '${filmId}' AND user_id = '${userId}' RETURNING *`));
  }

  async getLaterFilms(userId, page = 1, limit = 'ALL') {
    if(page < 1 || limit < 1) {
      throw ApiError.BadRequest('Invalid incoming data');
    }
    const offset = limit !== 'ALL' ? (page - 1) * limit : page-1;
    return (await db.query(`SELECT * FROM later_film WHERE user_id = '${userId}' LIMIT ${limit} OFFSET '${offset}'`));
  }

  async addLaterFilm(filmId, refreshToken) {
    const userId = await UserService.getUserIdByToken(refreshToken);
    const film = await this.isFilmInTheTable(filmId, userId, 'later_film');
    if(film) {
      throw ApiError.BadRequest('The film is already in the table')
    }
    return (await db.query(`INSERT INTO later_film VALUES ('${filmId}', '${userId}') RETURNING *`))[0];
  }

  async removeLaterFilm(filmId, refreshToken) {
    const userId = await UserService.getUserIdByToken(refreshToken);
    return (await db.query(`DELETE FROM later_film WHERE id = '${filmId}' AND user_id = '${userId}' RETURNING *`));
  }

  async getRatedFilms(userId, page = 1, limit = 'ALL') {
    if(page < 1 || limit < 1) {
      throw ApiError.BadRequest('Invalid incoming data');
    }
    const offset = limit !== 'ALL' ? (page - 1) * limit : page-1;
    return (await db.query(`SELECT * FROM rated_film WHERE user_id = '${userId}' LIMIT ${limit} OFFSET '${offset}'`));
  }

  async addRatedFilm(filmId, rating, refreshToken) {
    const userId = await UserService.getUserIdByToken(refreshToken);
    return (await db.query(`INSERT INTO rated_film VALUES ('${filmId}', '${userId}', '${rating}') ON CONFLICT (id) DO UPDATE SET rating = excluded.rating RETURNING *`))[0];
  }

  async removeRatedFilm(filmId, refreshToken) {
    const userId = await UserService.getUserIdByToken(refreshToken);
    return (await db.query(`DELETE FROM rated_film WHERE id = '${filmId}' AND user_id = '${userId}' RETURNING *`));
  }

  async isFilmInTheTable (filmId, userId, table) {
    const film = (await db.query(`SELECT * FROM "${table}" WHERE id = '${filmId}' AND user_id = ${userId}`))[0];
    return Boolean(film);
  }

  async userFilm (filmId, refreshToken) {
    const userId = await UserService.getUserIdByToken(refreshToken);
    const isRated = await this.isFilmInTheTable(filmId, userId, 'rated_film');
    let rating;
    if(isRated) {
       rating = (await db.query(`SELECT rating FROM rated_film WHERE id = '${filmId}' AND user_id = '${userId}'`))[0].rating
    }
    return {
      isLater: await this.isFilmInTheTable(filmId, userId, 'later_film'),
      isFavourite: await this.isFilmInTheTable(filmId, userId, 'favourite_film'),
      isRated,
      rating
    };
  }
}

module.exports = new FilmService();