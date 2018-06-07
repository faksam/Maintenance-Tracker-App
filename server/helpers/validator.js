import { Pool } from 'pg';
import jwt from 'jwt-simple';
import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV;
let connectionString;

if (env === 'development') {
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = process.env.use_env_variable;
}

/**
 * Check if parameter is integer
 *
 * @param {*} n the id parameter passed with HTTP request
 * @returns {boolean} Is the parameter an integer
 */
const isInt = n => n === parseInt(n, 10);

export const setConnectionString = () => {
  let envConnectionString;
  if (env === 'development') {
    envConnectionString = process.env.DATABASE_URL;
  } else {
    envConnectionString = process.env.use_env_variable;
  }
  return envConnectionString;
};

/**
 * Decode user token if token is valid
 *
 * @param {*} userToken the token parameter passed with HTTP request.headers.authorization
 * @returns {boolean||object} false if token is invalid and token object if token is valid
 */
export const verifyToken = (userToken) => {
  const error = {};
  error.message = {};
  let decode = '';
  const authHeader = userToken.split(' ');
  decode = jwt.decode(authHeader[1], process.env.SECRET_TOKEN);
  return decode;
};


/**
 * @description - Verify User Token
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const verifyUserToken = (req, res, next) => {
  const error = {};
  error.message = {};
  let decode = '';
  if (req.headers.authorization === undefined || req.headers.authorization === null || req.headers.authorization === '') {
    error.message = 'Token not valid';
    return res.status(400).send({
      success: false,
      status: 400,
      error,
    });
  } else if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    const authHeader = req.headers.authorization.split(' ');
    try {
      decode = jwt.decode(authHeader[1], process.env.SECRET_TOKEN);
    } catch (err) {
      error.message = err;
    }
  }
  if (decode === '') {
    error.message = 'Token not valid';
    return res.status(400).send({
      success: false,
      status: 400,
      error,
    });
  }
  return next();
};

/**
 * @description - Verify Request Input
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const verifyRequestInput = (req, res, next) => {
  const error = {};
  error.message = {};
  const errorChecker = false;

  req.sanitizeBody('title').trim();
  req.sanitizeBody('description').trim();
  req.checkBody('title', 'Title is required, must be between 10-50 characters').notEmpty().isLength({ min: 10, max: 50 }).isString();
  req.checkBody('description', 'Description is required, must be between 20-500 characters').notEmpty().isLength({ min: 20, max: 500 }).isString();

  const errors = req.validationErrors();
  if (errors) {
    errors.forEach((value) => {
      error.message[value.param] = value.msg;
    });
    return res.status(400).send({
      success: false,
      status: 400,
      error,
    });
  }

  if (errorChecker) {
    return res.status(400).send({
      success: false,
      status: 400,
      error,
    });
  }

  return next();
};

/**
 * @description - Verify User Request
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const verifyUserRequest = (req, res, next) => {
  const error = {};
  error.message = {};
  const requestId = parseInt(req.params.id, 10);
  if (requestId < 0 || !isInt(requestId)) {
    // either age was not a valid number, integer, or is not in range
    error.message = 'id parameter must be a valid integer number';
    return res.status(400).send({
      success: false,
      status: 400,
      error,
    });
  }
  return next();
};

/**
 * @description - Check If User Request Exist
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const checkIfUserRequestExist = (req, res, next) => {
  const error = {};
  error.message = {};
  const decode = verifyToken(req.headers.authorization);
  const requestId = parseInt(req.params.id, 10);
  const pool = new Pool({
    connectionString,
  });
  const selectQuery = {
    name: 'get-users-request',
    text: 'SELECT * FROM requests WHERE userid = $1 AND id = $2',
    values: [decode.sub, requestId],
  };
  pool.query(selectQuery, (err, result) => {
    pool.end();
    if (err || (result.rows.length === 0)) {
      error.message = `Request with id - ${requestId} does not exist for current user`;
      return res.status(404).send({
        success: false,
        status: 404,
        error,
      });
    }
    return next();
  });
};

/**
 * @description - Check If Request Exist
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const checkIfRequestExist = (req, res, next) => {
  const error = {};
  error.message = {};
  const requestId = parseInt(req.params.id, 10);
  const pool = new Pool({
    connectionString,
  });
  const selectQuery = {
    name: 'get-users-request',
    text: 'SELECT * FROM requests WHERE id = $1',
    values: [requestId],
  };
  pool.query(selectQuery, (err, result) => {
    pool.end();
    if (err || (result.rows.length === 0)) {
      error.message = 'Request does not exist';
      return res.status(404).send({
        success: false,
        status: 404,
        error,
      });
    }
    return next();
  });
};

/**
 * @description - Validate Request ID
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const validateRequestID = (req, res, next) => {
  const error = {};
  error.message = {};
  const requestId = parseInt(req.params.id, 10);
  if (requestId < 0 || !isInt(requestId)) {
    // either age was not a valid number, integer, or is not in range
    error.message = 'id parameter must be a valid integer number';
    return res.status(400).send({
      success: false,
      status: 400,
      error,
    });
  }
  return next();
};

/**
 * @description - Check Request Status
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const checkRequestStatus = (req, res, next) => {
  const error = {};
  error.message = {};
  const requestId = parseInt(req.params.id, 10);
  const queryValues = [];
  const pool = new Pool({
    connectionString,
  });
  queryValues.push(requestId);
  pool.query('SELECT * FROM requests WHERE id = $1', [queryValues[0]], (err, result) => {
    if (result.rows[0].status !== 'New') {
      error.message = 'Only New Requests Can Be Edited!';
      return res.status(400).send({
        success: false,
        status: 400,
        error,
      });
    }
    pool.end();
    return next();
  });
};


/**
 * @description - Verify Reject/Disapprove Input
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const verifyDisapprovalInput = (req, res, next) => {
  const error = {};
  error.message = {};
  const errorChecker = false;

  req.checkBody('comment', 'Please input the reason why this request is disapproved, input must be between 20-500 characters').notEmpty().isLength({ min: 20, max: 500 }).isString();

  const errors = req.validationErrors();
  if (errors) {
    errors.forEach((value) => {
      error.message[value.param] = value.msg;
    });
    return res.status(400).send({
      success: false,
      status: 400,
      error,
    });
  }

  if (errorChecker) {
    return res.status(400).send({
      success: false,
      status: 400,
      error,
    });
  }

  return next();
};


/**
 * @description - Check If Request is New
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const checkIfRequestNew = (req, res, next) => {
  const error = {};
  error.message = {};
  const requestId = parseInt(req.params.id, 10);
  const pool = new Pool({
    connectionString,
  });
  const selectQuery = {
    name: 'get-users-request',
    text: 'SELECT * FROM requests WHERE id = $1',
    values: [requestId],
  };
  pool.query(selectQuery, (err, result) => {
    pool.end();
    if (err || (result.rows[0].status !== 'New')) {
      error.message = 'You can only approve a new request';
      return res.status(400).send({
        success: false,
        status: 400,
        error,
      });
    }
    return next();
  });
};

/**
 * @description - Check If Request is Pending
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const checkIfRequestPending = (req, res, next) => {
  const error = {};
  error.message = {};
  const requestId = parseInt(req.params.id, 10);
  const pool = new Pool({
    connectionString,
  });
  const selectQuery = {
    name: 'get-users-request',
    text: 'SELECT * FROM requests WHERE id = $1',
    values: [requestId],
  };
  pool.query(selectQuery, (err, result) => {
    pool.end();
    if (err || (result.rows[0].status !== 'Pending')) {
      error.message = 'You can only resolve a pending request';
      return res.status(400).send({
        success: false,
        status: 400,
        error,
      });
    }
    return next();
  });
};

/**
 * @description - Check If Request is New
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const checkIfRequestRejectable = (req, res, next) => {
  const error = {};
  error.message = {};
  const requestId = parseInt(req.params.id, 10);
  const pool = new Pool({
    connectionString,
  });
  const selectQuery = {
    name: 'get-users-request',
    text: 'SELECT * FROM requests WHERE id = $1',
    values: [requestId],
  };
  pool.query(selectQuery, (err, result) => {
    pool.end();
    if (err || (result.rows[0].status !== 'New')) {
      error.message = 'You can only reject a new request';
      return res.status(400).send({
        success: false,
        status: 400,
        error,
      });
    }
    return next();
  });
};

