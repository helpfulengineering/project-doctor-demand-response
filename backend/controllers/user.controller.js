var express = require('express');
var dataAccess = require('../data-access/mongo.dataaccess');
var emailUtil = require('../util/email');
const jwt = require('jsonwebtoken');
var cfg = require("../security/jwtConfig");

// Regular users must only be able to modify / delete their own profile
// Admin - full access
let userController = {
    registerUser: async function(req, res) {
        
        let user = req.body;
        
        let existingUser = await dataAccess.find('users', {'user_name': req.body.user_name});

        if(existingUser) {
            return {status: false, data: {existingUser: true}};
        }

        user.status = 'new';
        user.activation_code = emailUtil.generateActivationCode(req.app.email_config.activation_code_length);
        dataAccess.add('users', req.body);

        let params = { 'to': req.body.email};
        params.template = 'activation_email';
        params.subject = 'MHM Account Activation';
        params.activation_url = req.app.common_config.app_root_url + 'activate?user_name=' + user.user_name + '&code=' + user.activation_code;
        params.support_email = req.app.common_config.support_email;
        emailUtil.sendMail(req.app.mailer, params);

        return {status: true};
    },
    activateUser: async function(req, res) {
        
        let user = await dataAccess.find('users', { 'user_name': req.body.user_name});
        
        if(user.user_name === req.body.user_name && user.activation_code === req.body.code && user.status === 'new') {
            user.status = 'active';
            user.activation_code = '';
            user = userController.initializeForUpdate(user);
            dataAccess.update('users', user);
            return true;
        }

        return false;
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
    login: async function(req, res) {
        let user = await dataAccess.find('users', {'user_name': req.body.user_name});
    
        if(user) {
            if(user.status == 'new') {
                return { status: false, data: {userNotActivated: true}};
            } else if(user.status == 'suspended') {
                return { status: false, data: {userSuspended: true}};
            } else if(user && req.body.password == user.password) {

                if(user.status == 'active') {
                    var payload = {
                        id: user._id,
                        user_name: user.user_name
                    };
                    var token = jwt.sign(payload, cfg.jwtSecret, { expiresIn: '1d' });
                    res.json({
                        status: true,
                        token: token,
                        user: payload
                    });
                }
            } else {
                let update = {'_id': user._id, 'failed_login_attempt': user.failed_login_attempt + 1};
                console.log(user.failed_login_attempt);
                if(user.failed_login_attempt > 3) {
                    update.status = 'suspended';
                }
                dataAccess.update('users', update);
            }
        }
        return { status: false, data: {loginFailed: true}};
    },
    search: async function(req, res) {
        let data = await dataAccess.search('users', req.body);
        return data;
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