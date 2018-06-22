import { Pool } from 'pg';
import { setConnectionString } from './connectionString';

const connectionString = setConnectionString();

/**
 * @description - Check If Request is New
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const checkIfRequestIsNew = (req, res, next) => {
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
    const { status } = result.rows[0];
    if ((status === 'Pending') || (status === 'Resolved')) {
      error.message = 'You can only approve a new/disapproved request';
      return res.status(400).send({
        success: false,
        status: 400,
        error,
      });
    }
    return next();
  });
};

export default checkIfRequestIsNew;
