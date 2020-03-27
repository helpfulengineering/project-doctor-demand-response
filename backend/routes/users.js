var express = require('express');
var router = express.Router();
const userController = require('../controllers/user.controller.js');
const jwt = require('jsonwebtoken');
var app = require('../app');
var cfg = require("../security/jwtConfig");
var auth = require("../security/auth");
var dataAccess = require('../data-access/mongo.dataaccess');

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
    let data = await userController.login(req, res);
    
    if(data.unauthorized) {
      res.sendStatus(401);
    } else {
      res.send(data);
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
