import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import { decodeToken } from '../validators/tokenValidator';
import { setConnectionString } from '../helpers/connectionString';

const connectionString = setConnectionString();

/**
 * @class accountController
 *
 * @export
 */

export default class accountController {
  /**
   * @description - Get a Users Account Details
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberOf accountController
   *
   * @returns {object} response JSON Object
   */
  static getUserDetails(req, res) {
    const pool = new Pool({
      connectionString,
    });
    const decode = decodeToken(req.headers.authorization);
    const selectQuery = {
      name: 'get-users-account-details',
      text: 'SELECT * FROM users WHERE id = $1',
      values: [decode.id],
    };
    pool.query(selectQuery, (err, result) => {
      const [user] = result.rows;
      pool.end();
      return res.status(200).send({
        success: true,
        status: 200,
        data: {
          fullName: user.fullname,
          email: user.email,
          role: user.role,
        },
      });
    });
  }

  /**
   * @description - Change a Users Account Password
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberOf accountController
   *
   * @returns {object} response JSON Object
   */
  static updateUserPassword(req, res) {
    const {
      newPassword,
    } = req.body;
    const pool = new Pool({
      connectionString,
    });
    const decode = decodeToken(req.headers.authorization);
    const saltRounds = 12;
    bcrypt.hash(newPassword, saltRounds)
      .then((hash) => {
        const insertQuery = {
          name: 'update-users-password',
          text: 'UPDATE users SET password=$1 WHERE id = $2 RETURNING *',
          values: [hash, decode.id],
        };
        pool.query(insertQuery, (err, result) => {
          const [user] = result.rows;
          return res.status(200).send({
            success: true,
            status: 200,
            data: {
              fullName: user.fullname,
              email: user.email,
              role: user.role,
            },
          });
        });
        pool.end();
      });
  }

  /**
   * @description - Update a Users Account Details
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberOf accountController
   *
   * @returns {object} response JSON Object
   */
  static updateUserDetails(req, res) {
    const {
      fullName, email,
    } = req.body;
    const pool = new Pool({
      connectionString,
    });
    const decode = decodeToken(req.headers.authorization);
    const insertQuery = {
      name: 'get-users-requests',
      text: 'UPDATE users SET fullname=$1, email=$2 WHERE id = $3 RETURNING *',
      values: [fullName, email, decode.id],
    };
    pool.query(insertQuery, (err, result) => {
      const [user] = result.rows;
      pool.end();
      return res.status(200).send({
        success: true,
        status: 200,
        data: {
          fullName: user.fullname,
          email: user.email,
          role: user.role,
        },
      });
    });
  }
}
