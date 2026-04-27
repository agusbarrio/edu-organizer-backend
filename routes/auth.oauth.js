'use strict';

const { Router } = require('express');
const passport = require('passport');
const { envConfig } = require('../config/envConfig');
const { googleConfigured, microsoftConfigured } = require('../config/passport');
const authServices = require('../services/auth');
const ERRORS = require('../constants/errors');

const router = Router();

function oauthFailureRedirect() {
  return `${envConfig.CORS_ORIGIN}/auth/login?error=oauth_unauthorized`;
}

function oauthSuccessRedirect(token) {
  const encoded = encodeURIComponent(token);
  return `${envConfig.CORS_ORIGIN}/auth/oauth-success#access_token=${encoded}`;
}

function googleCallback(req, res, next) {
  passport.authenticate('google', (err, user) => {
    if (err || !user) {
      return res.redirect(oauthFailureRedirect());
    }
    try {
      const { token } = authServices.buildLoginJwtForUser(user);
      return res.redirect(oauthSuccessRedirect(token));
    } catch (e) {
      return res.redirect(oauthFailureRedirect());
    }
  })(req, res, next);
}

function microsoftCallback(req, res, next) {
  passport.authenticate('microsoft', (err, user) => {
    if (err || !user) {
      return res.redirect(oauthFailureRedirect());
    }
    try {
      const { token } = authServices.buildLoginJwtForUser(user);
      return res.redirect(oauthSuccessRedirect(token));
    } catch (e) {
      return res.redirect(oauthFailureRedirect());
    }
  })(req, res, next);
}

router.get('/google', (req, res, next) => {
  if (!googleConfigured()) return next(ERRORS.E503_1);
  passport.authenticate('google', { scope: ['email', 'profile'] })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  if (!googleConfigured()) return next(ERRORS.E503_1);
  googleCallback(req, res, next);
});

router.get('/microsoft', (req, res, next) => {
  if (!microsoftConfigured()) return next(ERRORS.E503_1);
  passportConfigured.authenticate('microsoft')(req, res, next);
});

router.get('/microsoft/callback', (req, res, next) => {
  if (!microsoftConfigured()) return next(ERRORS.E503_1);
  microsoftCallback(req, res, next);
});

module.exports = router;
