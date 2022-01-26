const compress_images = require('compress-images')
const fs = require("fs");

class FileService {
  async uploadImage(image,PATH) {
    await image.mv(PATH);
    return PATH;
  }

  async compressImage(user_id) {
    const INPUT_PATH = `${process.env.FILE_PATH}/avatar${user_id}.jpg`;
    const OUTPUT_PATH = `${process.env.FILE_PATH}/compressed/`;
    if(fs.existsSync(`${OUTPUT_PATH}/avatar${user_id}.jpg`)) {    // remove if exists
      fs.unlinkSync(`${OUTPUT_PATH}/avatar${user_id}.jpg`)
    }

    await compress_images(INPUT_PATH, OUTPUT_PATH, { compress_force: false, statistic: true, autoupdate: true }, false,
      { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
      { png: { engine: false, command: false } },
      { svg: { engine: false, command: false } },
      { gif: { engine: false, command: false } },
      function (error, completed, statistic) {
      }
    );
  }

  getUserImage(PATH) {
    if(fs.existsSync(PATH)){
      return fs.readFileSync(PATH, 'base64');
    }
    return null;
  }

  getUserCompressedImage(user_id) {
    const PATH = `${process.env.FILE_PATH}/compressed/avatar${user_id}.jpg`;
    if(fs.existsSync(PATH)) {
      return fs.readFileSync(PATH, 'base64');
    }
    return null;
  }
}

module.exports = new FileService();