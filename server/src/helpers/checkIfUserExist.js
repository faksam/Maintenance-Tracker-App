import { Pool } from 'pg';
import { setConnectionString } from './connectionString';

const connectionString = setConnectionString();

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
      error.message = err;
    } else if (result.rows.length === 0) {
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

export default checkIfUserExist;
