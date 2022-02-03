const UserService = require('../service/user-service')
const {validationResult} = require('express-validator')
const ApiError = require('../exceptions/api-error')
const FileService = require("../service/file-service");

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        return next(ApiError.BadRequest('Validation Error', errors.array()))
      }
      const {email, password} = req.body;
      const userData = await UserService.registration(email, password);
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
      return res.json(userData);
    } catch (err) {
      next(err);
    }
  }

  async changeUsername(req, res, next) {
    try {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        return next(ApiError.BadRequest('Validation Error', errors.array()))
      }
      const {username, user_id} = req.body;
      const userData = await UserService.changeUsername(username, user_id);
      return res.json(userData);
    } catch (err) {
      next(err)
    }
  }

  async login(req, res, next) {
    try {
      const {email, password} = req.body;
      const userData = await UserService.login(email, password)
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true, secure: true, sameSite: 'none'});
      return res.json(userData);
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const token = await UserService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (err) {
      next(err);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      const user = await UserService.activate(activationLink);
      if(user){
        return res.json({activated: true});
      }
    } catch (err) {
      next(err);
    }
  }

  async refresh(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const userData = await UserService.refresh(refreshToken)
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true, secure: true, sameSite: 'none'});
      return res.json(userData);
    } catch (err) {
      next(err);
    }
  }

  async getUserInfo(req, res, next) {
    try {
      const {user_id} = req.params;
      const data = await UserService.getUserInfo(user_id);
      return res.json(data);
    } catch (err) {
      next(err)
    }
  }

  async changeUserImage(req, res, next) {
    try {
      const image = req.files.image;
      const {user_id} = req.body;
      const PATH = `${process.env.FILE_PATH}/avatar${user_id}.jpg`;
      await FileService.uploadImage(image, PATH);
      await FileService.compressImage(user_id);
      return res.json(PATH);
    } catch (err) {
      next(err)
    }
  }

  getUserImage(req, res, next) {
    try {
      const {user_id} = req.params;
      const PATH = `${process.env.FILE_PATH}/avatar${user_id}.jpg`
      const imageBase64 = FileService.getUserImage(PATH);

      return res.json(imageBase64);
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new UserController();