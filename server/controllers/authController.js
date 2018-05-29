import uuid from 'uuid';
import jwt from 'jwt-simple';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { setConnectionString } from '../helpers/validator';

const connectionString = setConnectionString();

let userToken;
const tokenForUser = (user) => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.SECRET_TOKEN);
};

const signup = (req, res) => {
  const pool = new Pool({
    connectionString,
    // ssl: true,
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
        text: 'INSERT INTO users (id,fullname,email,phoneNo,password,role) VALUES ($1, $2, $3, $4, $5, $6)',
        values: [userId, fullName, userEmail, phoneNo, hash, 'User'],
      };
      pool.query(signUpQuery, () => {
        pool.end();
      });
      userToken = tokenForUser({ user: { id: userId } });
      res.set('authorization', userToken).status(201).send({
        success: true,
        status: 201,
        token: userToken,
        data: {
          Fullname: fullName,
          Email: email,
          Phone: phoneNo,
        },
      });
    });
};

const login = (req, res) => {
  const pool = new Pool({
    connectionString,
    // ssl: true,
  });
  const {
    email, password,
  } = req.body;
  const userEmail = email.toLowerCase();

  const queryValues = [];
  queryValues.push(userEmail);

  pool.query('SELECT * FROM users WHERE email = $1', [queryValues[0]], (err, result) => {
    let user;
    bcrypt.compare(password, result.rows[0].password)
      .then((validPassword) => {
        if (validPassword) {
          [user] = result.rows;
          userToken = tokenForUser(result.rows[0]);
        }
        return res.set('authorization', userToken).status(200).send({
          success: true,
          status: 200,
          token: userToken,
          data: {
            Fullname: user.fullname,
            Email: user.email,
            Phone: user.phoneno,
          },
        });
      });
  });
  pool.end();
};

module.exports = { signup, login };
