var express = require('express');
var dataAccess = require('../data-access/mongo.dataaccess');

// Regular users must only be able to modify / delete their supply requests
// Admin - full access
let supplyRequestController = {
    add: function(req, res) {
        dataAccess.add('supply_request', req.body);
    },
    update: function(req, res) {

        let supply_request = supplyRequestController.initializeForUpdate(supply_request);
        dataAccess.update('supply_request', supply_request);
    },
    delete: function(req, res) {
        dataAccess.delete('supply_request', req.body._id);
    },
    view: async function(req, res) {
        let data = await dataAccess.view('supply_request', req.query._id);
        return data;
    },
    search: async function(req, res) {
        let data = await dataAccess.search('supply_request', req.body);
        return data;
    },
    initializeForUpdate: function(supply_request) {
        
        delete supply_request.created_by;
        delete supply_request.created_date;

        return supply_request;
    }
};


module.exports = supplyRequestController;