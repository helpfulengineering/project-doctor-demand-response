var express = require('express');
var dataAccess = require('../data-access/mongo.dataaccess');

// Regular users must only be able to modify / delete their supply requests
// Admin - full access
let supplyRequestController = {
    add: function(req, res) {
        dataAccess.add('supply_request', req.body);
    },
    update: function(req, res) {
        dataAccess.update('supply_request', req.body);
    },
    delete: function(req, res) {
        dataAccess.delete('supply_request', req.body._id);
    },
    view: async function(req, res) {
        let data = await dataAccess.view('supply_request', req.query._id);
        return data;
    },
    search: function(req, res) {
        console.log('controller called');
    }
};


module.exports = supplyRequestController;