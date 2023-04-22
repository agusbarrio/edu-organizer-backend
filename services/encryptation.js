'use strict ';
//const crypto = require('crypto');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const { envConfig } = require('../config/envConfig');
const { nanoid } = require('nanoid');
const ERRORS = require('../constants/errors');
/* 
const cipher = crypto.createDecipheriv(
  'aes-256-cbc',
  envConfig.SECRET_CIPHER_KEY,
  Buffer.alloc(16, 0)
);
 */
const encryptationServices = {
  createShortId: function () {
    return nanoid(5);
  },
  convertTextToHash: async (data) => {
    const hash = await bcrypt.hash(data, 10);
    return hash;
  },
  compareTextWithHash: async (plainText, hash) => {
    const result = await bcrypt.compare(plainText, hash);
    return result;
  },
  /*   cipherText: function (text) {
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return encrypted;
    },
    decipherText: function (text) {
      let decrypted = cipher.update(text, 'hex', 'utf8');
      decrypted += cipher.final('utf8');
      return decrypted;
    }, 
  compareTextWithCipher: function (plainText, cipher) {
    return this.cipherText(plainText) === cipher;
  },*/
  createToken: (data, type, options = {}) => {
    const defaultOptions = { expiresIn: envConfig.DEFAULT_TOKEN_DURATION };
    const tokenOptions = _.merge(defaultOptions, options);
    return jwt.sign({ data, type }, envConfig.JWT_SECRET, tokenOptions);
  },
  validToken: function (token, type) {
    if (!token) throw ERRORS.E401;
    let decodedToken;
    jwt.verify(token, envConfig.JWT_SECRET, function (err, decoded) {
      if (err) throw ERRORS.E401;
      if (decoded.data.type !== type) throw ERRORS.E401
      decodedToken = decoded;
    });
    return decodedToken;
  },


};

module.exports = encryptationServices;
