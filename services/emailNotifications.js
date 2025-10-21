'use strict';

const _ = require('lodash');
const mustache = require('mustache');
const EMAIL_TEMPLATES = require('../constants/emailTemplates');
const { envConfig } = require('../config/envConfig');
const ERRORS = require('../constants/errors');
const { Resend } = require('resend');
const resend = new Resend(envConfig.RESEND_API_KEY);

module.exports.sendMail = async (template, to, cc = '', bcc = '') => {
  const msg = {
    to,
    cc,
    bcc,
    from: `EduOrganizer - <${envConfig.RESEND_EMAIL}>`,
    subject: 'EduOrganizer',
    html: 'ups',
    ...template,
  };
  await resend.emails.send(msg);
};

module.exports.getTemplate = (templateKey, params) => {
  const template = _.find(EMAIL_TEMPLATES, { key: templateKey });
  if (!template) throw ERRORS.E500;
  return {
    html: mustache.render(template.html, params),
    subject: mustache.render(template.subject, params),
    from: envConfig.RESEND_EMAIL,
  };
};
