import { Pool } from 'pg';
import { setConnectionString } from './connectionString';

const connectionString = setConnectionString();

/**
 * @description - Verify if User Exist
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const checkEmailExist = (req, res, next) => {
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

export default checkEmailExist;
