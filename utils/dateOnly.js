const moment = require('moment');

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Normalize to YYYY-MM-DD for Sequelize DATEONLY (calendar day, not an instant).
 * Use for required dates (e.g. class session). If missing, defaults to today (server local).
 */
function normalizeDateOnlyInput(input) {
  if (input === undefined || input === null) {
    return moment().format('YYYY-MM-DD');
  }
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (DATE_ONLY.test(trimmed)) {
      return trimmed;
    }
  }
  return moment.utc(input).format('YYYY-MM-DD');
}

/** Optional DATEONLY (e.g. student birthDate): null / empty stays null. */
function normalizeOptionalDateOnlyInput(input) {
  if (input === undefined || input === null || input === '') {
    return null;
  }
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (trimmed === '') return null;
    if (DATE_ONLY.test(trimmed)) {
      return trimmed;
    }
  }
  return moment.utc(input).format('YYYY-MM-DD');
}

module.exports = { normalizeDateOnlyInput, normalizeOptionalDateOnlyInput };
