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
        let user = userController.initializeForUpdate(req.body);
        dataAccess.update('users', user);
    },
    viewProfile: async function(req, res) {
        // Access restriction
        let data = await dataAccess.view('users', req.query._id);
        return data;
    },
    login: async function(req, _) {
        const { user_name, password } = req.body;
        validateUsername(user_name);
        let user = await dataAccess.find('users', { user_name });

        verifyPassword(user, password);
        return user;
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

function validateUsername(user_name){
    if(typeof(user_name) !== 'string' || user_name.length === 0) {
        throw Error('Invalid credentials');
    }
}

function verifyPassword(user, password){
    if(!user || password !== user.password) {
        throw Error('Invalid credentials');
    }
}


module.exports = userController;