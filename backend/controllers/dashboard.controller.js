var express = require('express');
var dataAccess = require('../data-access/mongo.dataaccess');

// Regular users must only be able to modify / delete their own profile
// Admin - full access
let dashboardController = {
    getDashboardData: async function(req, res) {
        // Access restriction
        let user = await dataAccess.view('users', req.query._id);
        let data = {};
        data.hcp_count = await dataAccess.count('users',{'type': 'H'});
        data.volunteer_count = await dataAccess.count('users',{'type': 'V'});
        data.supply_request_count = await dataAccess.count('supply_request',{'status': 'open'});
        data.inventory_count = await dataAccess.count('inventory',{});

        return {status: true, data: data};
    }
};


module.exports = dashboardController;