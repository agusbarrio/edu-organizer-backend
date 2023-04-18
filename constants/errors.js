'use strict';

const ERRORS = {
  //400
  E400: { errorCode: 'E400', message: 'Bad request', status: 400 },
  //401
  E401: { errorCode: 'E401', message: 'Unauthorized', status: 401 },
  //403
  E403: { errorCode: 'E403', message: 'Forbidden', status: 403 },
  //404
  E404: { errorCode: 'E404', message: 'Not found.', status: 404 },
  E404_1: { errorCode: 'E404_1', message: 'User not found.', status: 404 },
  //409
  E409: { errorCode: 'E409', message: 'Conflict', status: 409 },
  E409_1: { errorCode: 'E409_1', message: 'Email already exists', status: 409 },
  //422
  E422: { errorCode: 'E422', message: 'Unprocessable Entity', status: 422 },
  //500
  E500: { errorCode: 'E500', message: 'Internal server error.', status: 500 },
};

module.exports = ERRORS;
