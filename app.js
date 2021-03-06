const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();

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

app.use('/', index);
app.use('/users', users);
app.use('/registration', registration);
app.use('/login', login);
app.use('/restaurant', restaurant);
app.use('/menu', menu);
app.use('/item', item);
app.use('/expense', expense);
app.use('/category', category);
app.use('/transaction', transaction);
app.use('/sales', sales);
app.use('/dashboard', dashboard);

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
  res.send('error');
});

module.exports = app;
