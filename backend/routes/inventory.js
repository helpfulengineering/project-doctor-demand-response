var express = require('express');
var router = express.Router();
const inventoryController = require('../controllers/inventory.controller.js');
var auth = require("../security/auth");

// Update password
router.put('/add', auth.authenticate(), function(req, res, next) {
  inventoryController.add(req, res);
  res.send({status: true});
});

// Update User Profile
router.post('/update', auth.authenticate(), function(req, res, next) {
  inventoryController.update(req, res);
  res.send({status: true});
});

router.get('/view',auth.authenticate(),  async function(req, res, next) {
  let data = await inventoryController.view(req, res);
  res.send({status: true, data: data});
});

router.get('/search', auth.authenticate(), async function(req, res, next) {
  let data = await inventoryController.search(req, res);
  res.send({status: true, data: data});
});

// Login
router.post('/delete', auth.authenticate(), function(req, res, next) {
  inventoryController.delete(req, res);
  res.send({status: true});
});

module.exports = router;
