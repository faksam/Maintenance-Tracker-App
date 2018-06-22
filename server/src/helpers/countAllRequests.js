import { Pool } from 'pg';
import { setConnectionString } from './connectionString';

const connectionString = setConnectionString();

/**
 * @description - Count All Requests
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 */
export const countAllRequests = (req, res, next) => {
  const pool = new Pool({
    connectionString,
  });

  pool.query('SELECT COUNT(id) FROM requests', (err, result) => {
    req.requestCount = result.rows[0].count;
    return next();
  });
};

export default countAllRequests;
