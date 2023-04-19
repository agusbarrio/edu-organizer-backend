'use strict ';
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { ERRORS } = require('../../core');
const jwt = require('jsonwebtoken');
const { envConfig } = require('../config/envConfig');

const cipher = crypto.createDecipheriv(
  'aes-256-cbc',
  envConfig.SECRET_CIPHER_KEY,
  Buffer.alloc(16, 0)
);

const utilsServices = {
  convertTextToHash: async (data) => {
    const hash = await bcrypt.hash(data, 10);
    return hash;
  },
  compareTextWithHash: async (plainText, hash) => {
    const result = await bcrypt.compare(plainText, hash);
    return result;
  },
  cipherText: function (text) {
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
  },
  validToken: function (token) {
    if (!token) throw ERRORS.E401;
    let decodedToken;
    jwt.verify(token, envConfig.JWT_SECRET, function (err, decoded) {
      if (err) throw ERRORS.E401;
      decodedToken = decoded;
    });
    return decodedToken;
  },
};

module.exports = utilsServices;
