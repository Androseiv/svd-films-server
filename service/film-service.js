const db = require('../db/index')
const ApiError = require('../exceptions/api-error')

class FilmService {
  LATER_FILM = 'later_film';
  FAVOURITE_FILM = 'favourite_film';
  RATED_FILM = 'rated_film';

  async getFavouriteFilms(user_id, page = 1, limit = 'ALL') {
    if(page < 1 || limit < 1) {
      throw ApiError.BadRequest('Invalid incoming data');
    }
    const offset = limit !== 'ALL' ? (page - 1) * limit : page-1;
    return (await db.query(`SELECT id, time FROM favourite_film WHERE user_id = '${user_id}' LIMIT ${limit} OFFSET '${offset}'`));
  }

  async addFavouriteFilm(film_id, user_id) {
    const film = await this.isFilmInTheTable(film_id, user_id, this.FAVOURITE_FILM);
    if(film) {
      throw ApiError.BadRequest('The film is already in the table')
    }
    return (await db.query(`INSERT INTO favourite_film VALUES ('${film_id}', '${user_id}') RETURNING *`))[0];
  }

  async removeFavouriteFilm(film_id, user_id) {
    return (await db.query(`DELETE FROM favourite_film WHERE id = '${film_id}' AND user_id = '${user_id}' RETURNING *`));
  }

  async getLaterFilms(user_id, page = 1, limit = 'ALL') {
    if(page < 1 || limit < 1) {
      throw ApiError.BadRequest('Invalid incoming data');
    }
    const offset = limit !== 'ALL' ? (page - 1) * limit : page-1;
    return (await db.query(`SELECT id, time FROM later_film WHERE user_id = '${user_id}' LIMIT ${limit} OFFSET '${offset}'`));
  }

  async addLaterFilm(film_id, user_id) {
    const film = await this.isFilmInTheTable(film_id, user_id, this.LATER_FILM);
    if(film) {
      throw ApiError.BadRequest('The film is already in the table')
    }
    return (await db.query(`INSERT INTO later_film VALUES ('${film_id}',  '${user_id}') RETURNING *`))[0];
  }

  async removeLaterFilm(film_id, user_id) {
    return (await db.query(`DELETE FROM later_film WHERE id = '${film_id}' AND user_id = '${user_id}' RETURNING *`));
  }

  async getRatedFilms(user_id, page = 1, limit = 'ALL') {
    if(page < 1 || limit < 1) {
      throw ApiError.BadRequest('Invalid incoming data');
    }
    const offset = limit !== 'ALL' ? (page - 1) * limit : page-1;
    return (await db.query(`SELECT id, time, rating FROM rated_film WHERE user_id = '${user_id}' LIMIT ${limit} OFFSET '${offset}'`));
  }

  async addRatedFilm(film_id, rating, user_id) {
    const userRating = (await db.query(`SELECT * FROM rated_film WHERE id = '${film_id}' AND user_id = '${user_id}'`))[0];
    if(userRating) {
      return (await db.query(`UPDATE rated_film SET rating = '${rating}' WHERE id = '${film_id}' AND user_id = '${user_id}' RETURNING *`))[0];
    }
    return (await db.query(`INSERT INTO rated_film VALUES ('${film_id}', '${user_id}', '${rating}') RETURNING *`))[0];
  }

  async removeRatedFilm(film_id, user_id) {
    return (await db.query(`DELETE FROM rated_film WHERE id = '${film_id}' AND user_id = '${user_id}' RETURNING *`));
  }

  async isFilmInTheTable (film_id, user_id, table) {
    const film = (await db.query(`SELECT * FROM "${table}" WHERE id = '${film_id}' AND user_id = ${user_id}`))[0];
    return Boolean(film);
  }

  async userFilm (film_id, user_id) {
    const isRated = await this.isFilmInTheTable(film_id, user_id, this.RATED_FILM);
    let rating;
    if(isRated) {
       rating = (await db.query(`SELECT rating FROM rated_film WHERE id = '${film_id}' AND user_id = '${user_id}'`))[0].rating
    }
    return {
      isLater: await this.isFilmInTheTable(film_id, user_id, this.LATER_FILM),
      isFavourite: await this.isFilmInTheTable(film_id, user_id, this.FAVOURITE_FILM),
      isRated,
      rating
    };
  }
}

module.exports = new FilmService();