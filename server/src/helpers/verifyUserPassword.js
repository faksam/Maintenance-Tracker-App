import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { setConnectionString } from './connectionString';

const connectionString = setConnectionString();

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

export default verifyUserPassword;
