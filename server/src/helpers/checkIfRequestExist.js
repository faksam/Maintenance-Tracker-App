import { Pool } from 'pg';
import { setConnectionString } from './connectionString';

const connectionString = setConnectionString();

/**
 * @description - Check If Request Exist
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const checkIfRequestExist = (req, res, next) => {
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
    if (err || (result.rows.length === 0)) {
      error.message = 'Request does not exist';
      return res.status(404).send({
        success: false,
        status: 404,
        error,
      });
    }
    return next();
  });
};

export default checkIfRequestExist;
