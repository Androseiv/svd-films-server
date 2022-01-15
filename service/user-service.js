const db = require('../db/index')
const bcrypt = require('bcrypt');
const MailService = require('./mail-service')
const TokenService = require('./token-service')
const uuid = require('uuid')
const ApiError = require('../exceptions/api-error')

class UserService {
  async registration(email, password) {
    const user = (await db.query(`SELECT * FROM "user" WHERE email = '${email}'`))[0];
    if(user) {
      throw ApiError.BadRequest(`User with the email ${email} is already exists.`);
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();

    const newUser = (await db.query(`INSERT INTO "user"(email, username, password, isActivated, activationLink) VALUES ('${email}', '${email}', '${hashPassword}', false, '${activationLink}') RETURNING *`))[0];
    await MailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
    return TokenService.generateAndSaveTokens(newUser)
  }

  async login(email, password) {
    const user = (await db.query(`SELECT * FROM "user" WHERE email = '${email}'`))[0];
    if(!user) {
      throw ApiError.BadRequest(`User with the email ${email} is not registered`);
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if(!isPassEquals){
      throw ApiError.BadRequest('Incorrect password');
    }
    return TokenService.generateAndSaveTokens(user)
  }

  async logout(refreshToken) {
    return await TokenService.removeToken(refreshToken);
  }

  async activate(activationLink) {
    const user = (await db.query(`SELECT * FROM "user" WHERE activationlink = '${activationLink}'`))[0];
    if(!user) {
      throw ApiError.BadRequest('Incorrect activation link');
    }
    await db.query(`UPDATE "user" SET isactivated='true' WHERE id='${user.id}'`);
    return user;
  }

  async refresh(refreshToken) {
    if(!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = TokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await TokenService.findToken(refreshToken);
    if(!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = (await db.query(`SELECT * FROM "user" WHERE id = ${userData.id}`))[0];
    return TokenService.generateAndSaveTokens(user)
  }

  async getUserIdByToken(refreshToken) {
    return (await db.query(`SELECT user_id FROM token WHERE refreshtoken = '${refreshToken}'`))[0].user_id
  }

}

module.exports = new UserService();