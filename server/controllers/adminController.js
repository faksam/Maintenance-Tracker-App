import { Pool } from 'pg';
import { setConnectionString } from '../helpers/validator';

const connectionString = setConnectionString();

/**
 * @class usersController
 *
 * @export
 */
export default class usersController {
  /**
     * @description - Get all Users Requests
     * @static
     *
     * @param {object} req - HTTP Request
     * @param {object} res - HTTP Response
     *
     * @memberOf usersController
     *
     * @returns {object} response JSON Object
     */
  static getRequests(req, res) {
    const pool = new Pool({
      connectionString,
      // ssl: true,
    });
    pool.query('SELECT * FROM requests ORDER BY id', (err, result) => {
      res.status(200).send({
        success: true,
        status: 200,
        data: result.rows,
      });
      pool.end();
    });
  }

  /**
   * @description - Approve a Request
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberOf usersController
   *
   * @returns {object} response JSON Object
   */
  static approveRequest(req, res) {
    const requestId = parseInt(req.params.id, 10);
    const status = 'Pending';
    const pool = new Pool({
      connectionString,
      // ssl: true,
    });
    const insertQuery = {
      name: 'get-users-requests',
      text: 'UPDATE requests SET status=$1 WHERE id = $2 RETURNING *',
      values: [status, requestId],
    };
    pool.query(insertQuery, (err, result) => {
      res.status(200).send({
        success: true,
        status: 200,
        data: result.rows,
      });
      pool.end();
    });
  }

  /**
   * @description - Reject a Request
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberOf usersController
   *
   * @returns {object} response JSON Object
   */
  static rejectRequest(req, res) {
    const requestId = parseInt(req.params.id, 10);
    const status = 'Disapproved';
    const pool = new Pool({
      connectionString,
      // ssl: true,
    });
    const insertQuery = {
      name: 'get-users-requests',
      text: 'UPDATE requests SET status=$1 WHERE id = $2 RETURNING *',
      values: [status, requestId],
    };
    pool.query(insertQuery, (err, result) => {
      const queryValues = [];
      queryValues.push(requestId);
      res.status(200).send({
        success: true,
        status: 200,
        data: result.rows,
      });
      pool.end();
    });
  }

  /**
   * @description - Resolve a Request
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberOf usersController
   *
   * @returns {object} response JSON Object
   */
  static resolveRequest(req, res) {
    const requestId = parseInt(req.params.id, 10);
    const status = 'Resolved';
    const queryValues = [];
    queryValues.push(requestId);
    const pool = new Pool({
      connectionString,
      // ssl: true,
    });
    const insertQuery = {
      name: 'get-users-requests',
      text: 'UPDATE requests SET status=$1 WHERE id = $2 RETURNING *',
      values: [status, requestId],
    };
    pool.query(insertQuery, (err, result) => {
      res.status(200).send({
        success: true,
        status: 200,
        data: result.rows,
      });
      pool.end();
    });
  }
}
