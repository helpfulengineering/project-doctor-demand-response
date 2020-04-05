var express = require('express');
var dataAccess = require('../data-access/mongo.dataaccess');
var emailUtil = require('../util/email');
const jwt = require('jsonwebtoken');
var cfg = require("../security/jwtConfig");
const bcrypt = require('bcryptjs');

// Regular users must only be able to modify / delete their own profile
// Admin - full access
let userController = {
    registerUser: async function(req, res) {
        
        let user = req.body;
        
        let existingUser = await dataAccess.find('users', {'user_name': user.user_name});

        if(existingUser) {
            return {status: false, data: {existingUser: true}};
        }

        userController.validateUserRequest(user);
        await userController.hashPassword(user);
        
        user.status = 'new';
        user.activation_code = emailUtil.generateActivationCode(req.app.email_config.activation_code_length);
        await dataAccess.add('users', user);

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
            await dataAccess.update('users', user);
            return true;
        }

        return false;
    },
    unRegisterUser: async function(req, res) {
        // Access restriction
        await dataAccess.delete('users', req.body._id);
    },

    updatePasswordRequest: async function(req, res) {
        let user = await dataAccess.find('users', { 'user_name': req.body.user_name});
        if(user){
            if(user.status === 'active' || user.status === 'suspended') {
                user.password_update_code = emailUtil.generateActivationCode(req.app.email_config.activation_code_length);
                await dataAccess.update('users', { "_id" : user._id, "password_update_code": user.password_update_code});
                
                let params = { 'to': req.body.email};
                params.template = 'updatePassword_email';
                params.subject = 'MHM Update Password';
                params.updatePassword_url = req.app.common_config.app_root_url + 'updatePassword?user_name=' + user.user_name + '&code=' + user.password_update_code;
                params.support_email = req.app.common_config.support_email;
                emailUtil.sendMail(req.app.mailer, params);
                
                return {status: true, data: {existingUser: true, userNotActivated: false}};
            }
            return {status: false, data: {existingUser: true, userNotActivated: true}};
        }
        return {status: false, data: {existingUser: false, userNotActivated: true}};
    },

    updatePasswordCodeVerify: async function(req, res) {
        
        let user = await dataAccess.find('users', { 'user_name': req.body.user_name});
        
        if(user.user_name === req.body.user_name && user.password_update_code === req.body.code) {
            user.password_update_code = '';
            await dataAccess.update('users', { "_id" : user._id, "password_update_code": user.password_update_code});
            return true;
        }

        return false;
    },

    updatePassword: async function(req, res) {
        let user = await dataAccess.find('users', { 'user_name': req.body.user_name});
        if(user){
            if(user.status == 'new'){
                return {status: false, data: {existingUser: true, userNotActivated: true}};
            }
            user.status = 'active';
            user.failed_login_attempt = 0;
            user.password = req.body.password;
            await userController.hashPassword(user);
            await dataAccess.update('users', { "_id" : user._id, "status": user.status, 'failed_login_attempt': user.failed_login_attempt, "password": user.password}); 
            return {status: true, data: {existingUser: true, userNotActivated: false}};
            
        }
        return {status: false, data: {existingUser: false, userNotActivated: true}};
        
    },
    updateProfile: async function(req, res) {
        // Access restriction
        let user = userController.initializeForUpdate(req.body);
        await dataAccess.update('users', user);
    },
    viewProfile: async function(req, res) {
        // Access restriction
        let data = await dataAccess.view('users', req.query._id);
        return data;
    },
    login: async function(req, res) {

        let user = await dataAccess.find('users', {'user_name': req.body.user_name});

        if(user) {
            let passwordVerified = await this.verifyPassword(req.body, user.password);
            if(user.status == 'new') {
                return { 
                    status: false, 
                    data: {
                        userNotActivated: true, 
                        userSuspended: false, 
                        loginFailed: true, 
                        existingUser: true}
                };
            } else if(user.status == 'suspended') {
                return { 
                    status: false, 
                    data: {
                        userNotActivated: false, 
                        userSuspended: true,
                        loginFailed: true,
                        existingUser: true}
                    };
            } else if(user && passwordVerified) {

                if(user.status == 'active') {
                    user.failed_login_attempt = 0;
                    await dataAccess.update('users', { "_id" : user._id, 'failed_login_attempt': user.failed_login_attempt});
                    var payload = {
                        id: user._id,
                        user_name: user.user_name
                    };
                    var token = jwt.sign(payload, cfg.jwtSecret, { expiresIn: '1d' });
                    res.json({
                        status: true,
                        token: token,
                        data: {
                            userNotActivated: false,
                            userSuspended: false,
                            loginFailed: false, 
                            existingUser: true},
                        user: payload
                    });
                }
            } else {
                let update = {'_id': user._id, 'failed_login_attempt': user.failed_login_attempt + 1};
                console.log(user.failed_login_attempt);
                if(user.failed_login_attempt > 3) {
                    update.status = 'suspended';
                }
                await dataAccess.update('users', update);
                return { 
                    status: false, 
                    data: {
                        userNotActivated: false,
                        userSuspended: false,
                        loginFailed: true, 
                        existingUser: true}};
            }
        }
        return { 
            status: false, 
            data: {
                userNotActivated: true,
                userSuspended: false,
                loginFailed: true, 
                existingUser: false}};
    },
    
    search: async function(req, res) {
        let data = await dataAccess.search('users', req.body);
        return data;
    },
    deactivateUser: async function(req, res) {   
        // Access restriction
        await dataAccess.update('users', { "_id" : req.body._id, "active": false});
    },
    initializeForUpdate: function(user) {
        delete user.created_by;
        delete user.created_date;
        delete user.email;
        delete user.user_name;
        delete user.password;
        return user;
    },
    validateUserRequest: function(userRequest){
        const requiredFields = [
            'org_name',
            'user_name',
            'password',
            'city',
            'state',
            'country',
            'zipcode',
            'phone',
            'email',
        ];
    
        requiredFields.forEach(key => {
            if(typeof(userRequest[key]) !== 'string' || userRequest[key].length === 0){
                throw Error(`${key} field is required`);
            }
        })
    },
    
    hashPassword: async function(user){
        user.password = await bcrypt.hash(user.password, 10);
        //return user.password;
    },
    
    validateUsername: function(user_name){
        if(typeof(user_name) !== 'string' || user_name.length === 0) {
            throw Error('Invalid credentials');
        }
    },
    
    verifyPassword: async function(user, password){
        if(!user || !(await bcrypt.compare(user.password, password))) {
            return false;
        }

        return true;
    }
};


module.exports = userController;