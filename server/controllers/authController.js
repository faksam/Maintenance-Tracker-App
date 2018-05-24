import uuid from 'uuid';
import jwt from 'jwt-simple';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import appConfig from '../config/config';

dotenv.config();

const env = process.env.NODE_ENV;
let connectionString;

if (env === 'development') {
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = process.env.use_env_variable;
}

let userToken;
const tokenForUser = (user) => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, appConfig.secret);
};

const signup = (req, res) => {
  const pool = new Pool({
    connectionString,
  });
  const {
    fullName, email, phoneNo, password
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
  });
  const {
    email, password
  } = req.body;
  const userEmail = email.toLowerCase();

  const queryValues = [];
  queryValues.push(userEmail);

  pool.query('SELECT * FROM users WHERE email = $1', [queryValues[0]], (err, result) => {
    bcrypt.compare(password, result.rows[0].password)
      .then((validPassword) => {
        if (validPassword) {
          userToken = tokenForUser(result.rows[0]);
          return res.set('authorization', userToken).status(201).send({
            success: true,
            status: 201,
            token: userToken,
            data: {
              Fullname: result.rows[0].fullname,
              Email: result.rows[0].email,
              Phone: result.rows[0].phoneno,
            }
          });
        } return res.status(404).send({ error: 'User not found' });
      });
  });
  pool.end();
};

module.exports = { signup, login };
