const {body} = require("express-validator");
const UserController = require("../../controllers/user-controller");

const router = require('express').Router();

router.post('/username/change',
  body('username').isLength({min: 3, max: 32}),
  UserController.changeUsername
);
router.post('/image/change', UserController.changeUserImage);
router.get('/info/user/:user_id', UserController.getUserInfo);

module.exports = router;