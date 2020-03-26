var express = require('express');
var dataAccess = require('../data-access/mongo.dataaccess');

// Regular users must only be able to modify / delete their own profile
// Admin - full access
let dashboardController = {
    getDashboardData: async function(req, res) {
        // Access restriction
        let data = await dataAccess.view('users', req.query._id);

        // statistics count aggregates

        // 

        return data;
    }
};


module.exports = dashboardController;