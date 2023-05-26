'use strict';
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const ERRORS = require('./constants/errors');
const { envConfig } = require('./config/envConfig');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const app = express();
const _ = require('lodash');
app.set('port', envConfig.PORT);

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
if (envConfig.LOGGING) app.use(morgan('combined'));

//cors
if (envConfig.CORS_CONFIG_ENABLED) {
  const corsOptions = {
    origin: envConfig.CORS_ORIGIN,
    optionsSuccessStatus: 200,
    credentials: true
  }
  if (!!corsOptions?.origin) {
    app.options('*', cors(corsOptions))
    app.use(cors(corsOptions))
  }
}


//Cookies
if (envConfig.COOKIES_CONFIG_ENABLED) {
  app.use(function (req, res, next) {
    const setCookie = res.cookie;
    res.cookie = function (key, value, options) {
      const defaultOptions = {
        expiresIn: envConfig.COOKIE_EXPIRES_IN_SEG,
        httpOnly: envConfig.COOKIE_HTTP_ONLY,
        sameSite: envConfig.COOKIE_SAME_SITE,
        secure: envConfig.COOKIE_SECURE,
        domain: envConfig.COOKIE_DOMAIN,
      }
      const mergedOptions = _.merge(defaultOptions, options);
      setCookie.call(res, key, value, mergedOptions);
    };
    next();
  });
}


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

module.exports = app;
