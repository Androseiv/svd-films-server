const UserService = require('../service/user-service')
const db = require('../db/index')

class FileService {
  async uploadImage(image, refreshToken) {
    const userId = (await UserService.getUserByToken(refreshToken)).user_id;
    const extension = image.mimetype.split('/').pop();
    const path = `${process.env.FILE_PATH}\\avatar${userId}.${extension}`;
    image.mv(path);

    const isImage = (await db.query(`SELECT * FROM user_photo WHERE path = '${path}'`))[0];
    if(isImage) {
      return path;
    }
    await db.query(`INSERT INTO user_photo VALUES ('${userId}', '${path}')`);
    return path;
  }
}

module.exports = new FileService();