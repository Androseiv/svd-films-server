const db = require('../db/index')

class FileService {
  async uploadImage(image, user_id) {
    const extension = image.mimetype.split('/').pop();
    const path = `${process.env.FILE_PATH}\\avatar${user_id}.${extension}`;
    image.mv(path);

    const isImage = (await db.query(`SELECT * FROM user_photo WHERE path = '${path}'`))[0];
    if(isImage) {
      return path;
    }
    await db.query(`INSERT INTO user_photo VALUES ('${user_id}', '${path}')`);
    return path;
  }
}

module.exports = new FileService();