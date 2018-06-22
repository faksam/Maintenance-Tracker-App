import { Pool } from 'pg';
import jwt from 'jwt-simple';
import { setConnectionString } from '../helpers/connectionString';

const connectionString = setConnectionString();

/**
 * @description - Decode user token if token is valid
 *
 * @param {*} userToken the token parameter passed with HTTP request.headers.authorization
 * @returns {boolean||object} false if token is invalid and token object if token is valid
 */
const decodeToken = (userToken) => {
  const error = {};
  error.message = {};
  let decode = '';
  if (userToken && userToken.split(' ')[0] === 'Bearer') {
    const authHeader = userToken.split(' ');
    try {
      decode = jwt.decode(authHeader[1], process.env.SECRET_TOKEN);
    } catch (err) {
      error.message = err;
    }
  }
  if (decode === '') {
    return false;
  }
  return decode;
};

/**
 * @description - Authorize Admin
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res HTTP Response
 */
export const authorizeAdmin = (req, res, next) => {
  const error = {};
  error.message = {};
  let errorChecker = false;
  const decode = decodeToken(req.headers.authorization);
  const pool = new Pool({
    connectionString,
  });
  const queryValues = [];
  queryValues.push(decode.sub);
  pool.query('SELECT * FROM users WHERE id = $1', [queryValues[0]], (err, result) => {
    pool.end();
    if (err) {
      errorChecker = true;
      error.message = 'You are not authorized. You do not seem to be logged in, please login and try again.';
    } else if (result.rows[0].role !== 'Admin') {
      errorChecker = true;
      error.message = 'You are Forbidden.';
    }
    if (errorChecker) {
      return res.status(403).send({
        success: false,
        status: 403,
        error,
      });
    }
    return next();
  });
};

/**
 * @description - Authorize User
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res HTTP Response
 */
export const authorizeUser = (req, res, next) => {
  const error = {};
  error.message = {};
  const decode = decodeToken(req.headers.authorization);
  const pool = new Pool({
    connectionString,
  });
  const queryValues = [];
  queryValues.push(decode.sub);
  pool.query('SELECT * FROM users WHERE id = $1', [queryValues[0]], (err, result) => {
    pool.end();
    if (err) {
      error.message = 'You are not authorized. You do not seem to be logged in, please login and try again.';
      return res.status(403).send({
        success: false,
        status: 403,
        error,
      });
    } else if (result.rows[0].length < 1) {
      error.message = 'You are Forbidden.';
      return res.status(403).send({
        success: false,
        status: 403,
        error,
      });
    }
    return next();
  });
};

