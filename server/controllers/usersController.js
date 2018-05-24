import { Pool } from 'pg';
import dotenv from 'dotenv';
import { verifyToken } from '../helpers/validator';

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
      ssl: true,
    });
    const decode = verifyToken(req, res);
    const queryValues = [];
    queryValues.push(decode.sub);
    pool.query('SELECT * FROM requests WHERE userid = $1', [queryValues[0]], (err, result) => {
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
      ssl: true,
    });
    const decode = verifyToken(req, res);
    const selectQuery = {
      name: 'get-users-requests',
      text: 'SELECT * FROM requests WHERE userid = $1 AND id = $2',
      values: [decode.sub, requestId],
    };
    pool.query(selectQuery, (err, result) => {
      if (result.rows.length > 0) {
        res.status(200).send({
          success: true,
          status: 200,
          data: result.rows,
        });
      } else {
        error.message = `Request with id - ${requestId} does not exist for current user`;
        return res.status(404).send({
          success: false,
          status: 404,
          error,
        });
      }
      pool.end();
    });
  }

  /**
   * @description - Add a new Request
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberOf usersController
   *
   * @returns {object} response JSON Object
   */
  static postRequest(req, res) {
    const {
      title, description
    } = req.body;
    const pool = new Pool({
      connectionString,
      ssl: true,
    });
    const decode = verifyToken(req, res);
    const insertQuery = {
      name: 'get-users-requests',
      text: 'INSERT INTO requests (title, description, date, status, userid) VALUES ($1, $2, $3, $4, $5)',
      values: [title, description, new Date(), 'New', decode.sub],
    };
    pool.query(insertQuery, () => {
      res.status(201).send({
        success: true,
        status: 201,
        data: {
          title,
          description,
          status: 'New'
        },
      });
      pool.end();
    });
  }

  /**
   * @description - Update a Request
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberOf usersController
   *
   * @returns {object} response JSON Object
   */
  static updateRequest(req, res) {
    const requestId = parseInt(req.params.id, 10);
    const {
      title, description
    } = req.body;
    const pool = new Pool({
      connectionString,
      ssl: true,
    });
    const decode = verifyToken(req, res);
    const insertQuery = {
      name: 'get-users-requests',
      text: 'UPDATE requests SET title=$1, description=$2 WHERE id = $3 AND userid = $4',
      values: [title, description, requestId, decode.sub],
    };
    pool.query(insertQuery, () => {
      res.status(200).send({
        success: true,
        status: 200,
        data: {
          title,
          description,
          status: 'New'
        },
      });
      pool.end();
    });
  }
}
