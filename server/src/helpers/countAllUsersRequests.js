import { Pool } from 'pg';
import { decodeToken } from '../validators/tokenValidator';
import { setConnectionString } from './connectionString';

const connectionString = setConnectionString();

/**
 * @description - Count All Users Requests
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 */
export const countAllUsersRequests = (req, res, next) => {
  const pool = new Pool({
    connectionString,
  });
  const decode = decodeToken(req.headers.authorization);
  const selectQuery = {
    name: 'get-users-requests',
    text: `SELECT COUNT(userid) FROM requests
              WHERE userid = $1`,
    values: [decode.id],
  };
  pool.query(selectQuery, (err, result) => {
    req.requestCount = result.rows[0].count;
    return next();
  });
};

export default countAllUsersRequests;
