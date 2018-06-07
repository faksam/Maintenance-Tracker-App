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
   * @description - Get a Request
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberOf usersController
   *
   * @returns {object} response JSON Object
   */
  static getRequest(req, res) {
    const error = {};
    error.message = {};
    const requestId = parseInt(req.params.id, 10);
    const pool = new Pool({
      connectionString,
    });
    const selectQuery = {
      name: 'get-users-request',
      text: `SELECT requests.id, requests.title, requests.description, requests.comment, requests.date, requests.status, requests.userid, users.fullname 
      FROM requests INNER JOIN users ON (requests.userid = users.id) 
      WHERE requests.id = $1`,
      values: [requestId],
    };
    pool.query(selectQuery, (err, result) => {
      pool.end();
      return res.status(200).send({
        success: true,
        status: 200,
        data: result.rows,
      });
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
  static approveRequest(req, res, next) {
    const requestId = parseInt(req.params.id, 10);
    const status = 'Pending';
    const pool = new Pool({
      connectionString,
    });
    const insertQuery = {
      name: 'get-users-requests',
      text: 'UPDATE requests SET status=$1 WHERE id = $2 RETURNING *',
      values: [status, requestId],
    };
    pool.query(insertQuery, (err, result) => {
      req.data = result.rows;
      res.status(200).send({
        success: true,
        status: 200,
        data: result.rows,
      });
      pool.end();
      next();
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
  static rejectRequest(req, res, next) {
    const {
      comment,
    } = req.body;
    const requestId = parseInt(req.params.id, 10);
    const status = 'Disapproved';
    const pool = new Pool({
      connectionString,
    });
    const insertQuery = {
      name: 'get-users-requests',
      text: 'UPDATE requests SET status=$1, comment=$2 WHERE id = $3 RETURNING *',
      values: [status, comment, requestId],
    };
    pool.query(insertQuery, (err, result) => {
      req.data = result.rows;
      const queryValues = [];
      queryValues.push(requestId);
      res.status(200).send({
        success: true,
        status: 200,
        data: result.rows,
      });
      pool.end();
      next();
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
  static resolveRequest(req, res, next) {
    const requestId = parseInt(req.params.id, 10);
    const status = 'Resolved';
    const queryValues = [];
    queryValues.push(requestId);
    const pool = new Pool({
      connectionString,
    });
    const insertQuery = {
      name: 'get-users-requests',
      text: 'UPDATE requests SET status=$1 WHERE id = $2 RETURNING *',
      values: [status, requestId],
    };
    pool.query(insertQuery, (err, result) => {
      req.data = result.rows;
      res.status(200).send({
        success: true,
        status: 200,
        data: result.rows,
      });
      pool.end();
      next();
    });
  }
}
