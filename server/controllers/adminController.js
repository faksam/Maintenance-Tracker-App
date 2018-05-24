import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV;
let connectionString;

if (env === 'development') {
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = process.env.use_env_variable;
}
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
    pool.query('SELECT * FROM requests', (err, result) => {
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
    const {
      status
    } = req.body;
    const pool = new Pool({
      connectionString,
    });
    const insertQuery = {
      name: 'get-users-requests',
      text: 'UPDATE requests SET status=$1 WHERE id = $2',
      values: [status, requestId],
    };
    pool.query(insertQuery, () => {
      res.status(200).send({
        success: true,
        status: 200,
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
    const {
      status
    } = req.body;
    const pool = new Pool({
      connectionString,
    });
    const insertQuery = {
      name: 'get-users-requests',
      text: 'UPDATE requests SET status=$1 WHERE id = $2',
      values: [status, requestId],
    };
    pool.query(insertQuery, () => {
      res.status(200).send({
        success: true,
        status: 200,
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
    const {
      status
    } = req.body;
    const pool = new Pool({
      connectionString,
    });
    const insertQuery = {
      name: 'get-users-requests',
      text: 'UPDATE requests SET status=$1 WHERE id = $2',
      values: [status, requestId],
    };
    pool.query(insertQuery, () => {
      res.status(200).send({
        success: true,
        status: 200,
      });
      pool.end();
    });
  }
}