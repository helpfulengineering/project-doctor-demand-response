var express = require('express');
var dataAccess = require('../data-access/mongo.dataaccess');

// Regular users must only be able to modify / delete their own profile
// Admin - full access
let userController = {
    registerUser: function(req, res) {
        
        dataAccess.add('users', req.body);
    },
    unRegisterUser: function(req, res) {
        // Access restriction
        dataAccess.delete('users', req.body._id);
    },
    updatePassword: function(req, res) {
        // Access restriction
        dataAccess.update('users', { "_id" : req.body._id, "password": req.body.password});
    },
    updateProfile: function(req, res) {
        // Access restriction
        dataAccess.update('users', req.body);
    },
    viewProfile: async function(req, res) {
        // Access restriction
        let data = await dataAccess.view('users', req.query._id);
        return data;
    },
    login: function(req, res) {
        console.log('controller called');
    },
    search: function(req, res) {
        // Access restriction
        console.log('controller called');
    },
    activateUser: function(req, res) {
        // Access restriction
        dataAccess.update('users', { "_id" : req.body._id, "active": true});
    },
    deactivateUser: function(req, res) {   
        // Access restriction
        dataAccess.update('users', { "_id" : req.body._id, "active": false});
    }
};


module.exports = userController;