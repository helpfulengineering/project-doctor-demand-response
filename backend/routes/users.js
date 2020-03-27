var express = require('express');
var router = express.Router();
const userController = require('../controllers/user.controller.js');
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
    let data = await userController.login(req, res);
    res.send(data);
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
