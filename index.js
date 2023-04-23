'use strict';
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const ERRORS = require('./constants/errors');
const { envConfig } = require('./config/envConfig');
const cookieParser = require('cookie-parser');

const app = express();

app.set('port', envConfig.PORT);

app.use(helmet());
app.use(cookieParser());
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
  const errorCode =
    err.errorCode ??
    (err.status === ERRORS.E400.status
      ? ERRORS.E400.errorCode
      : ERRORS.E500.errorCode);
  const message = err.message ?? ERRORS.E500.message;
  const data = err.data ?? undefined;
  console.error(err);
  res.status(err.status || ERRORS.E500.status).json({
    errorCode,
    message,
    data,
  });
});

app.listen(app.get('port'), () => {
  console.log(`Server running at port ${app.get('port')}`);
});
