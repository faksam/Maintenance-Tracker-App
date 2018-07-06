import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import { decodeToken } from '../validators/tokenValidator';
import { setConnectionString } from './connectionString';

const connectionString = setConnectionString();

/**
 * @description - Check Current Password Input
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const checkPasswordInput = (req, res, next) => {
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
  queryValues.push(decode.id);
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

export default checkPasswordInput;
