var express = require('express');
var router = express.Router();
const userController = require('../controllers/user.controller.js');
var auth = require("../security/auth");

// Register Account
router.put('/register', async function(req, res, next) {
  let data = await userController.registerUser(req, res);
  res.send(data);
});

// Un-Register Account
router.post('/unregister', auth.authenticate(), function(req, res, next) {
  userController.unRegisterUser(req, res);
  res.send({status: true});
});

// Activate user
router.post('/activate', async function(req, res, next) {
  let status = await userController.activateUser(req, res);
  res.send({status: status});
});

module.exports = router;
