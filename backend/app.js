var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var MongoClient = require('mongodb').MongoClient;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var supplyRequestRouter = require('./routes/supply-requests');
var inventoryRouter = require('./routes/inventory');
var auth = require("./security/auth");
var dbMgr = require('./data-access/db-manager');
var cors = require('cors');
var mailer = require('express-mailer');

var app = express();

/// DANGER DANGER DANGER Remove this code before moving to production
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(auth.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/supplyRequests', supplyRequestRouter);
app.use('/inventory', inventoryRouter);

app.constants = {
  db: {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017/',
    database: 'covid19'
  }
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

MongoClient.connect(app.constants.db.url, async function (err, database) {
  if (err) throw err;
  dbMgr.dbConnection = database.db(app.constants.db.database);
  await initializeEmailConfig(dbMgr.dbConnection);
  await initializeCommonConfig(dbMgr.dbConnection);
});

let initializeEmailConfig = async function(dbConnection) {
  await dbConnection.collection('sys_params').findOne({'name': 'email_config'}).then(email_config => {
    
    app.email_config = email_config;

    mailer.extend(app, {
      from: email_config.from,
      host: email_config.host, // hostname
      secureConnection: true, // use SSL
      port: 465, // port for secure SMTP
      transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
      auth: {
        user: email_config.auth_user,
        pass: email_config.auth_password
      }
    });

    console.log('Successfully loaded email config ' + JSON.stringify(email_config));
  }).catch(err => {
    console.log(err);
    throw err;
  });
}

let initializeCommonConfig = async function(dbConnection) {
  await dbConnection.collection('sys_params').findOne({'name': 'common_config'}).then(common_config => {
    app.common_config = common_config;
    console.log('Loaded common config ' + JSON.stringify(common_config));
  }).catch(err => {
    console.log(err);
    throw err;
  });
}

module.exports = app;
