var express = require('express');
var dataAccess = require('../data-access/mongo.dataaccess');
var emailUtil = require('../util/email');

// Regular users must only be able to modify / delete their own profile
// Admin - full access
let userController = {
    registerUser: function(req, res) {
        
        let user = req.body;
        user.status = 'new';
        user.activation_code = emailUtil.generateActivationCode(req.app.email_config.activation_code_length);
        dataAccess.add('users', req.body);

        let params = { 'to': req.body.email};
        params.template = 'activation_email';
        params.subject = 'MHM Account Activation';
        params.activation_url = req.app.common_config.app_root_url + 'activate?code=' + user.activation_code;
        params.support_email = req.app.common_config.support_email;
        emailUtil.sendMail(req.app.mailer, params);

        return true;
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
        let user = userController.initializeForUpdate(req.body);
        dataAccess.update('users', user);
    },
    viewProfile: async function(req, res) {
        // Access restriction
        let data = await dataAccess.view('users', req.query._id);
        return data;
    },
    login: function(req, res) {
        console.log('controller called');
    },
    search: async function(req, res) {
        let data = await dataAccess.search('users', req.body);
        return data;
    },
    activateUser: function(req, res) {
        // Access restriction
        dataAccess.update('users', { "_id" : req.body._id, "active": true});
    },
    deactivateUser: function(req, res) {   
        // Access restriction
        dataAccess.update('users', { "_id" : req.body._id, "active": false});
    },
    initializeForUpdate: function(user) {
        delete user.created_by;
        delete user.created_date;
        delete user.email;
        delete user.user_name;
        delete user.password;
        return user;
    }
};


module.exports = userController;