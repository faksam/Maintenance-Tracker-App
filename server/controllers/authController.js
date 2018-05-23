import uuid from 'uuid';
import jwt from 'jwt-simple';
import bcrypt from 'bcrypt';
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

const pool = new Pool({
  connectionString,
});

let userToken;
const tokenForUser = (user) => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.SECRET_TOKEN);
};

const signup = (req, res) => {
  const {
    fullName, email, phoneNo, password
  } = req.body;
  const userEmail = email.toLowerCase();

  const queryValues = [];
  queryValues.push(userEmail);
  // const phoneNo = req.body.phoneNo;
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
          'Full Name': fullName,
          Email: email,
          'Phone no': phoneNo
        },
      });
    });
};

module.exports = { signup };
