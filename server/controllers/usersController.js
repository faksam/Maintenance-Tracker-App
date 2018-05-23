import uuid from 'uuid';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { verifyToken } from '../helpers/validator';
// import json file
import usersRequest from '../db/usersRequest.json';

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
    const requestId = parseInt(req.params.id, 10);
    const pool = new Pool({
      connectionString,
    });
    const decode = verifyToken(req, res);
    const selectQuery = {
      name: 'get-users-requests',
      text: 'SELECT * FROM requests WHERE userid = $1 AND id = $2',
      values: [decode.sub, requestId],
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
    const newRequest = {};

    newRequest.id = usersRequest.requests.length + 1;
    newRequest.title = req.body.title;
    newRequest.description = req.body.description;
    newRequest.userId = uuid.v4();
    newRequest.date = new Date();
    newRequest.status = 'New';

    usersRequest.requests.push(newRequest);
    res.status(201).send({
      success: true,
      status: 201,
      data: {
        id: newRequest.id,
        title: newRequest.title,
        description: newRequest.description,
        date: newRequest.date,
        status: newRequest.status,
      }
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
    let foundRequest = {};
    const requestId = parseInt(req.params.id, 10);
    usersRequest.requests.forEach((element, index) => {
      if (element.id === requestId) {
        foundRequest = element;
        foundRequest.title = req.body.title;
        foundRequest.description = req.body.description;
        usersRequest.requests[index] = foundRequest;

        return res.status(200).send({
          success: true,
          status: 200,
          data: {
            id: foundRequest.id,
            title: foundRequest.title,
            description: foundRequest.description,
            date: foundRequest.date,
            status: foundRequest.status,
          }
        });
      }
    });
  }
}
