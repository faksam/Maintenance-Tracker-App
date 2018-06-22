import { Pool } from 'pg';
import { setConnectionString } from '../helpers/connectionString';
import { decodeToken } from '../validators/tokenValidator';

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
    const decode = decodeToken(req.headers.authorization);
    const selectQuery = {
      name: 'get-users-requests',
      text: `SELECT requests.id, requests.title, requests.description, requests.comment, requests.date, requests.status, requests.userid, users.fullname 
              FROM requests INNER JOIN users ON (requests.userid = users.id) 
              WHERE userid = $1
              ORDER BY requests.id LIMIT 20`,
      values: [decode.sub],
    };
    if (req.query.page !== undefined) {
      selectQuery.text = `SELECT requests.id, requests.title, requests.description, requests.comment, requests.date, requests.status, requests.userid, users.fullname 
      FROM requests INNER JOIN users ON (requests.userid = users.id) 
      WHERE userid = $1
      ORDER BY requests.id DESC OFFSET $2 LIMIT $3`;
      selectQuery.values.push(((req.query.page - 1) * 20));
      selectQuery.values.push(20);
    }
    pool.query(selectQuery, (err, result) => {
      res.status(200).send({
        success: true,
        status: 200,
        total: req.requestCount,
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
     * @description - Filter All Users Requests
     * @static
     *
     * @param {object} req - HTTP Request
     * @param {object} res - HTTP Response
     *
     * @memberOf adminController
     *
     * @returns {object} response JSON Object
     */
  static filterRequests(req, res) {
    const pool = new Pool({
      connectionString,
    });
    const decode = decodeToken(req.headers.authorization);
    const selectQuery = {
      name: 'filter-requests',
      text: `SELECT requests.id, requests.title, requests.description, requests.comment, requests.date, 
                requests.status, requests.userid, users.fullname 
                FROM requests INNER JOIN users ON (requests.userid = users.id) 
                WHERE userid = $1 AND title like $2 AND description like $2
                OR userid = $1 AND title like $2 AND description like $2
                ORDER BY id DESC LIMIT 20`,
      values: [decode.sub, `%${req.query.searchText}%`],
    };
    if (req.query.status !== 'All') {
      selectQuery.text = `SELECT requests.id, requests.title, requests.description, 
                requests.comment, requests.date, requests.status, requests.userid, users.fullname 
                FROM requests INNER JOIN users ON (requests.userid = users.id) 
                WHERE userid = $1 AND title like $2 AND description like $2 AND status = $3 
                OR userid = $1 AND title like $2 AND description like $2 AND status = $3 
                ORDER BY id DESC LIMIT 20`;
      selectQuery.values.push(req.query.status);
    }
    if (req.query.searchText === '') {
      selectQuery.values[1] = '% %';
    }
    if (req.query.page !== undefined) {
      selectQuery.text += ` OFFSET $${selectQuery.values.length + 1}`;
      selectQuery.values.push(((req.query.page - 1) * 20));
    }
    pool.query(selectQuery, (err, result) => {
      res.status(200).send({
        success: true,
        status: 200,
        total: result.rows.length,
        data: result.rows,
      });
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

  /**
   * @description - Delete a Request
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberOf adminController
   *
   * @returns {object} response JSON Object
   */
  static deleteRequest(req, res) {
    const requestId = parseInt(req.params.id, 10);
    const pool = new Pool({
      connectionString,
    });
    const deleteQuery = {
      name: 'delete-request',
      text: 'DELETE FROM requests WHERE id = $1 RETURNING *',
      values: [requestId],
    };
    pool.query(deleteQuery, (err, result) => {
      req.data = result.rows;
      req.data[0].status = 'Deleted';
      res.status(200).send({
        success: true,
        status: 200,
        data: result.rows,
      });
      pool.end();
    });
  }
}
