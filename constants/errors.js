'use strict';

module.exports.ERRORS = {
  E400: { errorCode: 'E400', message: 'Bad request', status: 400 },
  E401: { errorCode: 'E401', message: 'Unauthorized', status: 401 },
  E403: { errorCode: 'E403', message: 'Forbidden', status: 403 },
  E404: { errorCode: 'E404', message: 'Not found.', status: 404 },
  E409: { errorCode: 'E409', message: 'Conflict', status: 409 },
  E422: { errorCode: 'E422', message: 'Unprocessable Entity', status: 422 },
  E500: { errorCode: 'E500', message: 'Internal server error.', status: 500 },
};
