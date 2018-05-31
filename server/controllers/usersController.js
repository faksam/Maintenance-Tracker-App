import { Pool } from 'pg';
import jwt from 'jwt-simple';
import { setConnectionString } from '../helpers/validator';

const connectionString = setConnectionString();

/**
 * @class usersController
 *
 * @export
 */

/**
 * Decode user token if token is valid
 *
 * @param {*} userToken the token parameter passed with HTTP request.headers.authorization
 * @returns {boolean||object} false if token is invalid and token object if token is valid
 */
const decodeToken = (userToken) => {
  const error = {};
  error.message = {};
  let decode = '';
  const authHeader = userToken.split(' ');
  decode = jwt.decode(authHeader[1], process.env.SECRET_TOKEN);
  return decode;
};

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
    const decode = decodeToken(req.headers.authorization);
    const selectQuery = {
      name: 'get-users-requests',
      text: `SELECT requests.id, requests.title, requests.description, requests.comment, requests.date, requests.status, requests.userid, users.fullname 
              FROM requests INNER JOIN users ON (requests.userid = users.id) 
              WHERE userid = $1
              ORDER BY requests.id`,
      values: [decode.sub],
    };
    pool.query(selectQuery, (err, result) => {
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
    const decode = decodeToken(req.headers.authorization);
    const selectQuery = {
      name: 'get-users-request',
      text: 'SELECT * FROM requests WHERE userid = $1 AND id = $2',
      values: [decode.sub, requestId],
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
      title, description,
    } = req.body;
    const pool = new Pool({
      connectionString,
    });
    const decode = decodeToken(req.headers.authorization);
    const insertQuery = {
      name: 'create-a-new-users-requests',
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
          status: 'New',
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
      title, description,
    } = req.body;
    const pool = new Pool({
      connectionString,
    });
    const decode = decodeToken(req.headers.authorization);
    const updateQuery = {
      name: 'update-users-requests',
      text: 'UPDATE requests SET title=$1, description=$2 WHERE id = $3 AND userid = $4 RETURNING *',
      values: [title, description, requestId, decode.sub],
    };
    pool.query(updateQuery, (err, result) => {
      res.status(200).send({
        success: true,
        status: 200,
        data: result.rows[0],
      });
      pool.end();
    });
  }
}
