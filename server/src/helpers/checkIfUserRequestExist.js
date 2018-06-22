import { Pool } from 'pg';
import { setConnectionString } from './connectionString';
import { decodeToken } from '../validators/tokenValidator';

const connectionString = setConnectionString();

/**
 * @description - Check If User Request Exist
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
export const checkIfUserRequestExist = (req, res, next) => {
  const error = {};
  error.message = {};
  const decode = decodeToken(req.headers.authorization);
  const requestId = parseInt(req.params.id, 10);
  const pool = new Pool({
    connectionString,
  });
  const selectQuery = {
    name: 'get-users-request',
    text: 'SELECT * FROM requests WHERE userid = $1 AND id = $2',
    values: [decode.sub, requestId],
  };
  pool.query(selectQuery, (err, result) => {
    pool.end();
    if (err || (result.rows.length === 0)) {
      error.message = `Request with id - ${requestId} does not exist for current user`;
      return res.status(404).send({
        success: false,
        status: 404,
        error,
      });
    }
    return next();
  });
};

export default checkIfUserRequestExist;
