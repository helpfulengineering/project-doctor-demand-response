var express = require('express');
var dataAccess = require('../data-access/mongo.dataaccess');

// Regular users must only be able to modify / delete their inventories
// Admin - full access
let inventoryController = {
    add: function(req, res) {
        dataAccess.add('inventory', req.body);
    },
    update: function(req, res) {

        dataAccess.update('inventory', req.body);
    },
    delete: function(req, res) {
        dataAccess.delete('inventory', req.body._id);
    },
    view: async function(req, res) {
        let data = await dataAccess.view('inventory', req.query._id);
        return data;
    },
    search: function(req, res) {
        console.log('controller called');
    }
};


module.exports = inventoryController;