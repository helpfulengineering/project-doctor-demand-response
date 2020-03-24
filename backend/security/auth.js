const passport = require('passport');
var passportJWT = require("passport-jwt");
var cfg = require("./jwtConfig.js");
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = require('passport-jwt').Strategy;

const dataAccess = require('../data-access/mongo.dataaccess');
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = cfg.jwtSecret;
opts.issuer = cfg.issuer;

passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    
    try {
        let user = await dataAccess.find(null, 'users', {'user_name': jwt_payload.user_name});

        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch(err) {
        return done(err, false);
    }
}));

let auth = {
    initialize: function() {
        return passport.initialize();
    },
    authenticate: function() {
        return passport.authenticate("jwt", cfg.jwtSession);
    }
}

module.exports = auth;