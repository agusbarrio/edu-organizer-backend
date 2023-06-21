'use strict';

const ERRORS = {
  //400
  E400: { errorCode: 'E400', message: 'Bad request', status: 400 },
  //401
  E401: { errorCode: 'E401', message: 'Unauthorized', status: 401 },
  E401_1: { errorCode: 'E401_1', message: 'Invalid credentials', status: 401 },
  //403
  E403: { errorCode: 'E403', message: 'Forbidden', status: 403 },
  E403_1: { errorCode: 'E403_1', message: 'You do not have permission to access this resource', status: 403 },
  E403_2: { errorCode: 'E403_2', message: 'Inactive user', status: 403 },
  //404
  E404: { errorCode: 'E404', message: 'Not found.', status: 404 },
  E404_1: { errorCode: 'E404_1', message: 'User not found.', status: 404 },
  E404_2: { errorCode: 'E404_2', message: 'Course not found.', status: 404 },
  E404_3: { errorCode: 'E404_3', message: 'Student not found.', status: 404 },
  //409
  E409: { errorCode: 'E409', message: 'Conflict', status: 409 },
  E409_1: { errorCode: 'E409_1', message: 'Email already exists', status: 409 },
  E409_2: { errorCode: 'E409_2', message: 'User not pending', status: 409 },
  //422
  E422: { errorCode: 'E422', message: 'Unprocessable Entity', status: 422 },
  //500
  E500: { errorCode: 'E500', message: 'Internal server error.', status: 500 },
  E500_1: { errorCode: 'E500_1', message: 'Error sending email.', status: 500 },
};

module.exports = ERRORS;
