var express = require('express');
var router = express.Router();
const userController = require('../controllers/user.controller.js');
var auth = require("../security/auth");

// Register Account
router.put('/register', async function(req, res, next) {
  try{
    let status = await userController.registerUser(req, res);
    res.send({ status });
  }catch(e){
    res.status(400).json({ message: e.message });
  }
});

// Un-Register Account
router.post('/unregister', auth.authenticate(), function(req, res, next) {
  userController.unRegisterUser(req, res);
  res.send({status: true});
});

module.exports = router;
