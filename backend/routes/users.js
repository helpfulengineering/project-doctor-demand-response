var express = require('express');
var router = express.Router();
const userController = require('../controllers/user.controller.js');
const jwt = require('jsonwebtoken');
var app = require('../app');
var cfg = require("../security/jwtConfig");
var auth = require("../security/auth");

// Update password
router.post('/updatePassword', auth.authenticate(), function(req, res, next) {
  userController.updatePassword(req, res);
  res.send({status: true});
});

// Update User Profile
router.post('/updateProfile', auth.authenticate(), function(req, res, next) {
  userController.updateProfile(req, res);
  res.send({status: true});
});

router.get('/viewProfile', auth.authenticate(), async function(req, res, next) {
  let data = await userController.viewProfile(req, res);
  res.send({status: true, data: data});
});

router.post('/login',  async function(req, res) {
  try{
    let user = await userController.login(req, res);
    var payload = {
      id: user._id,
      user_name: user.user_name
    };
    var token = jwt.sign(payload, cfg.jwtSecret, { expiresIn: '1d' });
    res.json({
      status: true,
      token: token,
      user: payload
    });
  }catch(e){
    res.status(401).json({ message: 'unauthorized' });
  }
});

router.post('/search', auth.authenticate(), async function(req, res, next) {
  let data = await userController.search(req, res);
  res.send({status: true, data: data});
});

  // Logout
router.post('/logout', auth.authenticate(), function(req, res, next) {
  
  res.send({status: true});
});

module.exports = router;
