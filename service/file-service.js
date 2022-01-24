class FileService {
  async uploadImage(image, user_id) {
    const path = `${process.env.FILE_PATH}/avatar${user_id}.jpg`;
    image.mv(path);
    return path;
  }
}

module.exports = new FileService();