import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jwt-simple';
import { setConnectionString, verifyToken } from '../helpers/validator';

const connectionString = setConnectionString();

/**
 * Decode user token if token is valid
 *
 * @param {*} userToken the token parameter passed with HTTP request.headers.authorization
 * @returns {boolean||object} false if token is invalid and token object if token is valid
 */
export const decodeToken = (userToken) => {
  const error = {};
  error.message = {};
  let decode = '';
  const authHeader = userToken.split(' ');
  decode = jwt.decode(authHeader[1], process.env.SECRET_TOKEN);
  return decode;
};

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

  req.sanitizeBody('fullName').trim();
  req.sanitizeBody('phoneNo').trim();
  req.sanitizeBody('password').trim();
  req.sanitizeBody('email').trim();

  req.checkBody('fullName', 'Full Name is required, must be between 3-40 characters').notEmpty().trim().isLength({ min: 3, max: 40 })
    .isString();
  req.checkBody('phoneNo', 'Phone No is required, must be between 7-15 characters').notEmpty().trim().isLength({ min: 7, max: 15 })
    .isString();
  req.checkBody('password', 'Password is required, must be between 8-20 characters').notEmpty().trim().isLength({ min: 8, max: 20 })
    .isString();
  req.checkBody('email', 'Email is required, and must be a valid email').isEmail().trim();

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
 * @description - Validate Update User Account Input
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const validateUpdateAccountInput = (req, res, next) => {
  const error = {};
  error.message = {};

  req.sanitizeBody('fullName').trim();
  req.sanitizeBody('phoneNo').trim();
  req.sanitizeBody('email').trim();

  req.checkBody('fullName', 'Full Name is required, must be between 3-40 characters').notEmpty().trim().isLength({ min: 3, max: 40 })
    .isString();
  req.checkBody('phoneNo', 'Phone No is required, must be between 7-15 characters').notEmpty().trim().isLength({ min: 7, max: 15 })
    .isString();
  req.checkBody('email', 'Email is required, and must be a valid email').isEmail().trim();

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
 * @description - Check Current Password Input
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const checkCurrentPasswordInput = (req, res, next) => {
  const error = {};
  error.message = {};
  const pool = new Pool({
    connectionString,
  });
  const {
    password,
  } = req.body;
  const decode = decodeToken(req.headers.authorization);
  const queryValues = [];
  queryValues.push(decode.sub);
  pool.query('SELECT * FROM users WHERE id = $1', [queryValues[0]], (err, result) => {
    bcrypt.compare(password, result.rows[0].password)
      .then((validPassword) => {
        if (!validPassword) {
          error.message = 'Current Password is Invalid';
          return res.status(400).send({
            success: false,
            status: 400,
            error,
          });
        }
        pool.end();
        return next();
      });
  });
};


/**
 * @description - Validate Update User Password Input
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const validateUpdatePasswordInput = (req, res, next) => {
  const error = {};
  error.message = {};

  req.sanitizeBody('password').trim();
  req.sanitizeBody('newPassword').trim();
  req.sanitizeBody('confirmNewPassword').trim();

  req.checkBody('password', 'Current Password is required, usually between 8-20 characters').notEmpty().trim().isLength({ min: 8, max: 20 })
    .isString();
  req.checkBody('confirmNewPassword', 'Confirm New Password is required, must be between 8-20 characters').notEmpty().trim().isLength({ min: 8, max: 20 })
    .isString();
  req.checkBody('newPassword', 'New Password Input & Confirm New Password must be equal between 8-20 characters').equals(req.body.confirmNewPassword);

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

  req.sanitizeBody('password').trim();
  req.sanitizeBody('email').trim();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('email', 'Email is required, and must be a valid email').isEmail();

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
      error.message = 'Invalid Email or Password.';
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

/**
 * @description - Verify If User Password is correct
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const verifyUserPassword = (req, res, next) => {
  const {
    password, email,
  } = req.body;
  const queryValues = [];
  const error = {};
  error.message = {};

  const pool = new Pool({
    connectionString,
  });
  queryValues.push(email.toLowerCase());
  queryValues.push(password);
  pool.query('SELECT * FROM users WHERE email = $1', [queryValues[0]], (err, result) => {
    if (err) {
      error.err = err;
    }
    bcrypt.compare(password, result.rows[0].password, (bcrypterr, resp) => {
      if (!resp) {
        error.message = 'Invalid Email or Password.';
        return res.status(400).send({
          success: false,
          status: 400,
          error,
        });
      }
      return next();
    });
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
export const checkDuplicateRequest = (req, res, next) => {
  const {
    title, description,
  } = req.body;
  const error = {};
  error.message = {};
  let errorChecker = false;
  const decode = verifyToken(req.headers.authorization);
  const pool = new Pool({
    connectionString,
  });
  const selectQuery = {
    name: 'get-users-requests',
    text: `SELECT title, description, status
            FROM requests WHERE userid = $1
            AND title = $2
            AND description = $3
            AND status = $4`,
    values: [decode.sub, title, description, 'New'],
  };
  pool.query(selectQuery, (err, result) => {
    if (err) {
      errorChecker = true;
      error.err = err;
    } else if (result.rows.length !== 0) {
      errorChecker = true;
      error.message = 'Request already exist in database. You cannot create a duplicate request.';
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
