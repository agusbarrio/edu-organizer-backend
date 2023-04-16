'use strict';
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const { ERRORS } = require('./constants/errors');
const { envConfig } = require('./config/envConfig');

const app = express();

app.set('port', envConfig.PORT);

app.use(helmet());
app.use(express.json());
if (envConfig.LOGGING) app.use(morgan('combined'));

//routes
app.use('/api/v1', require('./routes'));

//error 404
app.use(function (req, res, next) {
  next(ERRORS.E404);
});

// error handler
app.use(function (err, req, res, next) {
  res
    .status(err.status || ERRORS.E500.status)
    .send(err.message || ERRORS.E500.message);
});

app.listen(app.get('port'), () => {
  console.log(`Server running at port ${app.get('port')}`);
});
