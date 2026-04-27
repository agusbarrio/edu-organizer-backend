'use strict';

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const { envConfig } = require('./envConfig');
const authServices = require('../services/auth');
const userRepositories = require('../repositories/user');
const { USER_VARIANTS } = require('../repositories/variants/user');

function googleConfigured() {
  return !!(
    envConfig.GOOGLE_CLIENT_ID &&
    envConfig.GOOGLE_CLIENT_SECRET &&
    envConfig.OAUTH_CALLBACK_BASE_URL
  );
}

function microsoftConfigured() {
  return !!(
    envConfig.MICROSOFT_CLIENT_ID &&
    envConfig.MICROSOFT_CLIENT_SECRET &&
    envConfig.OAUTH_CALLBACK_BASE_URL
  );
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userRepositories.getOneByIdWithLoginInclude(id);
    done(null, user || false);
  } catch (e) {
    done(e, false);
  }
});

if (googleConfigured()) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: envConfig.GOOGLE_CLIENT_ID,
        clientSecret: envConfig.GOOGLE_CLIENT_SECRET,
        callbackURL: `${envConfig.OAUTH_CALLBACK_BASE_URL}/auth/google/callback`,
        scope: ['email', 'profile'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.trim()?.toLowerCase();
          const user = await authServices.validateOAuthUser({ email });
          done(null, user);
        } catch (e) {
          done(e, false);
        }
      }
    )
  );
}

if (microsoftConfigured()) {
  passport.use(
    new MicrosoftStrategy(
      {
        clientID: envConfig.MICROSOFT_CLIENT_ID,
        clientSecret: envConfig.MICROSOFT_CLIENT_SECRET,
        callbackURL: `${envConfig.OAUTH_CALLBACK_BASE_URL}/auth/microsoft/callback`,
        scope: ['User.Read'],
        tenant: 'common',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.trim()?.toLowerCase();
          const user = await authServices.validateOAuthUser({ email });
          done(null, user);
        } catch (e) {
          done(e, false);
        }
      }
    )
  );
}

module.exports = {
  googleConfigured,
  microsoftConfigured,
};
