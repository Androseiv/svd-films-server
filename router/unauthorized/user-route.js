const {body} = require("express-validator");
const UserController = require("../../controllers/user-controller");

const router = require('express').Router();

router.post('/registration',
  body('email').isEmail(),
  body('password').isLength({min: 5, max: 32}),
  UserController.registration
);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/activate/:link', UserController.activate);
router.get('/refresh', UserController.refresh);

module.exports = router;