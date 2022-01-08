const jwt = require('jsonwebtoken')
const db = require('../db/index')

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload,`${process.env.JWT_ACCESS_SECRET}`, {expiresIn: '1h'});
    const refreshToken = jwt.sign(payload, `${process.env.JWT_REFRESH_SECRET}`, {expiresIn: '30d'});
    return {
      accessToken,
      refreshToken
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await db.query(`SELECT * from token where user_id = '${userId}'`);
    if(tokenData.length) {
      await db.query(`UPDATE token SET refreshtoken = '${refreshToken}' where user_id = '${userId}'`);
      return;
    }
    await db.query(`INSERT INTO token(user_id, refreshtoken) VALUES ('${userId}', '${refreshToken}')`);
  }

  async removeToken(refreshToken) {
    return (await db.query(`DELETE FROM token WHERE refreshtoken = '${refreshToken}' RETURNING refreshtoken`))[0];
  }
}

module.exports = new TokenService();