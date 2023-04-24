'use strict';

const sgMail = require('@sendgrid/mail');
const _ = require('lodash');
const mustache = require('mustache');
const EMAIL_TEMPLATES = require('../constants/emailTemplates');
const { envConfig } = require('../config/envConfig');
const ERRORS = require('../constants/errors');

if (envConfig.SENDGRID_APIKEY) sgMail.setApiKey(envConfig.SENDGRID_APIKEY);

const sendMail = async (template, to, cc = '', bcc = '') => {
  const msg = {
    to,
    cc,
    bcc,
    from: `EduOrganizer - <${envConfig.SENDGRID_EMAIL}>`,
    subject: 'EduOrganizer',
    html: 'ups',
    ...template,
  };
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.log(error);
    throw ERRORS.E500;
  }
};

const getTemplate = (templateKey, params) => {
  const template = _.find(EMAIL_TEMPLATES, { key: templateKey });
  if (!template) throw ERRORS.E500;
  return {
    html: mustache.render(template.html, params),
    subject: mustache.render(template.subject, params),
    from: envConfig.SENDGRID_EMAIL,
  };
};

module.exports = { sendMail, getTemplate };
