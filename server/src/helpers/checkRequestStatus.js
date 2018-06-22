import { Pool } from 'pg';
import { setConnectionString } from './connectionString';

const connectionString = setConnectionString();

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

export default checkRequestStatus;
