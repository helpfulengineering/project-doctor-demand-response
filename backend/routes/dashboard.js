var express = require('express');
var router = express.Router();
const dashboardController = require('../controllers/dashboard.controller.js');

// Get Dashboard data
router.get('/dashboard', function(req, res, next) {
  dashboardController.getDashboardData(req, res);
  res.send({status: true});
});

module.exports = router;
