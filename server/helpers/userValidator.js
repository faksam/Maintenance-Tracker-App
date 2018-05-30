import { Pool } from 'pg';
import { setConnectionString } from '../helpers/validator';

const connectionString = setConnectionString();

/**
 * @description - Verify if User Exist
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const verrifyUserExist = (req, res, next) => {
  const pool = new Pool({
    connectionString,

  });

  const email = req.body.email.toLowerCase();
  const queryValues = [];
  const error = {};
  error.message = {};
  let errorChecker = false;

  queryValues.push(email);
  pool.query('SELECT * FROM users WHERE email = $1', [queryValues[0]], (err, result) => {
    if (err) {
      errorChecker = true;
      error.err = err;
    }
    if (result.rows.length > 0) {
      errorChecker = true;
      error.message = 'This email/user already exist in our server, try signing in.';
      pool.end();
    }
    if (errorChecker) {
      return res.status(409).send({
        success: false,
        status: 409,
        error,
      });
    }
    return next();
  });
};

/**
 * @description - Validate Signup Input
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const validateSignUpInput = (req, res, next) => {
  const error = {};
  error.message = {};
  req.checkBody('fullName', 'Full Name is required, must be between 3-40 characters').notEmpty().isLength({ min: 3, max: 40 }).isString();
  req.checkBody('email', 'Email is required').notEmpty().isString();
  req.checkBody('phoneNo', 'Phone No is required, must be between 7-15 characters').notEmpty().isLength({ min: 7, max: 15 }).isString();
  req.checkBody('password', 'Password is required, must be between 8-20 characters').notEmpty().isLength({ min: 8, max: 20 }).isString();
  req.checkBody('email', 'Email does not appear to be valid').isEmail();

  // check the validation object for errors
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

  return next();
};

/**
 * @description - Validate Signin Input
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const validateSignInInput = (req, res, next) => {
  const error = {};
  error.message = {};
  let errorChecker = false;

  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('email', 'Email does not appear to be valid').isEmail();

  // check the validation object for errors
  const errors = req.validationErrors();
  if (errors) {
    errorChecker = true;
    errors.forEach((value) => {
      error.message[value.param] = value.msg;
    });
  }

  if (errorChecker) {
    return res.status(400).send({
      success: false,
      status: 400,
      error,
    });
  } return next();
};

/**
 * @description - Check If User Exist
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const checkIfUserExist = (req, res, next) => {
  const {
    email,
  } = req.body;
  const queryValues = [];
  const error = {};
  error.message = {};
  let errorChecker = false;

  const pool = new Pool({
    connectionString,

  });
  queryValues.push(email.toLowerCase());
  pool.query('SELECT * FROM users WHERE email = $1', [queryValues[0]], (err, result) => {
    if (err) {
      errorChecker = true;
      error.err = err;
    } else if ((result === undefined) || result.rows.length === 0) {
      errorChecker = true;
      error.message = 'User account does not exist.';
      pool.end();
    }
    if (!errorChecker) { return next(); }

    return res.status(400).send({
      success: false,
      status: 400,
      error,
    });
  });
};

