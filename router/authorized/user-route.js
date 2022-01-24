const {body} = require("express-validator");
const UserController = require("../../controllers/user-controller");

const router = require('express').Router();

router.post('/username/change',
  body('username').isLength({min: 3, max: 32}),
  UserController.changeUsername
);
router.post('/image/change', UserController.changeUserImage);
router.get('/info/:user_id', UserController.getUserInfo);
router.get('/image/:user_id', UserController.getUserImage);

module.exports = router;