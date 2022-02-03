const jwt = require('jsonwebtoken')
const db = require('../db/index')
const UserDto = require("../dtos/user-dto");
const FileService = require('../service/file-service')

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload,`${process.env.JWT_ACCESS_SECRET}`, {expiresIn: '1h'});
    const refreshToken = jwt.sign(payload, `${process.env.JWT_REFRESH_SECRET}`, {expiresIn: '30d'});
    return {
      accessToken,
      refreshToken
    }
  }

  async saveToken(user_id, refreshToken) {
    const tokenData = await db.query(`SELECT * from token where user_id = '${user_id}'`);
    if(tokenData.length) {
      await db.query(`UPDATE token SET refreshtoken = '${refreshToken}' where user_id = '${user_id}'`);
      return;
    }
    await db.query(`INSERT INTO token(user_id, refreshtoken) VALUES ('${user_id}', '${refreshToken}')`);
  }

  async removeToken(refreshToken) {
    return (await db.query(`DELETE FROM token WHERE refreshtoken = '${refreshToken}' RETURNING refreshtoken`))[0];
  }

  validateAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (err) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      console.log(process.env.JWT_REFRESH_SECRET, 'refresh!')
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return null;
    }
  }

  async findToken(refreshToken) {
    return (await db.query(`SELECT * FROM token WHERE refreshtoken = '${refreshToken}'`))[0];
  }

  async generateAndSaveTokens (user) {
    const userDto = new UserDto(user);
    const tokens = this.generateTokens({...userDto});
    await this.saveToken(userDto.id, tokens.refreshToken);

    return {...tokens, user: {...userDto, compressedImage: FileService.getUserCompressedImage(userDto.id), username: (await db.query(`SELECT username FROM "user" WHERE id = '${user_id}'`))[0].username}};
  }
}

module.exports = new TokenService();