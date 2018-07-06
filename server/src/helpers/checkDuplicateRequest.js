import { Pool } from 'pg';
import { setConnectionString } from './connectionString';
import { decodeToken } from '../validators/tokenValidator';

const connectionString = setConnectionString();

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
  const decode = decodeToken(req.headers.authorization);
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
    values: [decode.id, title, description, 'New'],
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

export default checkDuplicateRequest;
