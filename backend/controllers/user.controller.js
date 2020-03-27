const dataAccess = require('../data-access/mongo.dataaccess');
const bcrypt = require('bcryptjs');
// Regular users must only be able to modify / delete their own profile
// Admin - full access
const userController = {
    registerUser: async function({ body: user }, res) {
        validateUserRequest(user);
        await hashPassword(user);

        dataAccess.add('users', user);
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

        await verifyPassword(user, password);
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

function validateUserRequest(userRequest){
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
            throw Error(`User requires ${key} field`);
        }
    })
}

async function hashPassword(user){
    const password = user.password;
    delete user.password;
    delete user.passwordDupe;

    user.passwordHash = await bcrypt.hash(password, 10);
}

function validateUsername(user_name){
    if(typeof(user_name) !== 'string' || user_name.length === 0) {
        throw Error('Invalid credentials');
    }
}

async function verifyPassword(user, password){
    if(!user || !(await bcrypt.compare(password, user.passwordHash))) {
        throw Error('Invalid credentials');
    }
}


module.exports = userController;