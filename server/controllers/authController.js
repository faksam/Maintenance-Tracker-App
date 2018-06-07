import uuid from 'uuid';
import jwt from 'jwt-simple';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { setConnectionString } from '../helpers/validator';

const connectionString = setConnectionString();

let userToken;
const tokenForUser = (user) => {
  const timestamp = new Date().getTime();
  return jwt.encode({
    email: user.email, role: user.role, sub: user.id, iat: timestamp,
  }, process.env.SECRET_TOKEN);
};
  /**
   * @description - Signup a new user
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberOf authController
   *
   * @returns {object} response HTTP Response JSON Object
   */
const signup = (req, res) => {
  const pool = new Pool({
    connectionString,
  });
  const {
    fullName, email, phoneNo, password,
  } = req.body;
  const userEmail = email.toLowerCase();

  const queryValues = [];
  queryValues.push(userEmail);
  const saltRounds = 12;

  bcrypt.hash(password, saltRounds)
    .then((hash) => {
      const userId = uuid.v4();
      const signUpQuery = {
        name: 'signup-user',
        text: 'INSERT INTO users (id,fullname,email,phoneNo,password,role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        values: [userId, fullName, userEmail, phoneNo, hash, 'User'],
      };
      pool.query(signUpQuery, (err, result) => {
        const [user] = result.rows;
        userToken = tokenForUser(user);
        res.set('authorization', userToken).status(201).send({
          success: true,
          status: 201,
          token: userToken,
          data: {
            fullName: user.fullname,
            email: user.email,
            phoneNo: user.phoneno,
            role: user.role,
          },
        });
      });
      pool.end();
    });
};
  /**
   * @description - Login a new user
   * @static
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   *
   * @memberOf authController
   * @returns {object} response HTTP Response JSON Object
   */
const login = (req, res) => {
  const pool = new Pool({
    connectionString,
  });
  const {
    email, password,
  } = req.body;
  const userEmail = email.toLowerCase();

  const queryValues = [];
  queryValues.push(userEmail);

  pool.query('SELECT * FROM users WHERE email = $1', [queryValues[0]], (err, result) => {
    const [user] = result.rows;
    bcrypt.compare(password, result.rows[0].password)
      .then((validPassword) => {
        if (validPassword) {
          userToken = tokenForUser(user);
        }
        return res.set('authorization', userToken).status(200).send({
          success: true,
          status: 200,
          token: userToken,
          data: {
            fullName: user.fullname,
            email: user.email,
            phoneNo: user.phoneno,
            role: user.role,
          },
        });
      });
  });
  pool.end();
};

export default { signup, login };
