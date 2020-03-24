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
    url: 'mongodb://localhost:27017/',
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

MongoClient.connect(app.constants.db.url, function (err, database) {
  if (err) throw err;
  dbMgr.dbConnection = database.db(app.constants.db.database);
  dbMgr.dbConnection.collection('users').find().toArray(function (err, result) {
    if (err) throw err;
    console.log('Successfully connect to Mongo instance at ' + app.constants.db.url);
  })
});

module.exports = app;
