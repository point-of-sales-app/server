const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
var http = require('http');

const index = require('./routes/index');
const users = require('./routes/users');
const registration = require('./routes/registration');
const login = require('./routes/login');
const restaurant = require('./routes/restaurant');
const menu = require('./routes/menu');
const item = require('./routes/item');
const expense = require('./routes/expense');
const category = require('./routes/category');
const transaction = require('./routes/transaction');
const sales = require('./routes/sales');
const dashboard = require('./routes/dashboard');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', index);
app.use('/api/users', users);
app.use('/api/registration', registration);
app.use('/api/login', login);
app.use('/api/restaurant', restaurant);
app.use('/api/menu', menu);
app.use('/api/item', item);
app.use('/api/expense', expense);
app.use('/api/category', category);
app.use('/api/transaction', transaction);
app.use('/api/sales', sales);
app.use('/api/dashboard', dashboard);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

var server = http.createServer(app);
server.listen();

module.exports = app;
