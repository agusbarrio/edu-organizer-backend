'use strict ';
//const crypto = require('crypto');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const { envConfig } = require('../config/envConfig');
const { nanoid } = require('nanoid');
const ERRORS = require('../constants/errors');
const { v4: uuidv4 } = require('uuid');

//Checking the crypto module
const crypto = require('crypto');
const algorithm = 'aes-256-cbc'; //Using AES encryption
const key = crypto
  .createHash('sha512')
  .update(envConfig.ENCRYPTION_KEY)
  .digest('hex')
  .substring(0, 32)


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
  encrypt: function (text) {
    const iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
  },
  decrypt: function ({ encryptedData, iv }) {
    let encryptedText = Buffer.from(encryptedData, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  },
  uuidv4: uuidv4
};

module.exports = encryptationServices;
