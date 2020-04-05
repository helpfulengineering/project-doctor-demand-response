var express = require('express');
var router = express.Router();
const userController = require('../controllers/user.controller.js');
var auth = require("../security/auth");

// Update password request
router.post('/updatePasswordRequest', async function(req, res, next) {
  let data = await userController.updatePasswordRequest(req, res);
  res.send(data);
});

router.post('/updatePasswordCodeVerify', async function(req, res, next) {
  let status = await userController.updatePasswordCodeVerify(req, res);
  res.send({status: status});
});


// Update password
router.post('/updatePassword', async function(req, res, next) {
  let data = await userController.updatePassword(req, res);
  res.send(data);
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
