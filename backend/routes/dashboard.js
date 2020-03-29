var express = require('express');
var router = express.Router();
const dashboardController = require('../controllers/dashboard.controller.js');

// Get Dashboard data
router.get('/dashboard', async function(req, res, next) {
  let data = await dashboardController.getDashboardData(req, res);
  res.send(data);
});

module.exports = router;
