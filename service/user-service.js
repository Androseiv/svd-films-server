const db = require('../db/index')
const bcrypt = require('bcrypt');
const MailService = require('./mail-service')
const TokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
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

    const newUser = await db.query(`INSERT INTO "user"(email, username, password, isActivated, activationLink) VALUES ('${email}', '${email}', '${hashPassword}', false, '${activationLink}') RETURNING *`);
    await MailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

    const userDto = new UserDto(newUser[0]);
    const tokens = TokenService.generateTokens({...userDto});
    await TokenService.saveToken(userDto.id, tokens.refreshToken);
    return {...tokens, user: userDto};
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
    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({...userDto});

    await TokenService.saveToken(userDto.id, tokens.refreshToken);
    return {...tokens, user: userDto};
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

  async getUsers() {
    return await db.query('SELECT * from "user"');
  }
}

module.exports = new UserService();