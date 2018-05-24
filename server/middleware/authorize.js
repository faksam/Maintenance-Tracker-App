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


export const authorizeAdmin = (req, response, next) => {
  const decode = verifyToken(req, response, next);

  const pool = new Pool({
    connectionString,
    ssl: true,
  });
  const queryValues = [];
  queryValues.push(decode.sub);
  pool.query('SELECT * FROM users WHERE id = $1', [queryValues[0]], (err, result) => {
    if (err) {
      throw err;
    }
    if (result.rows[0].role === 'Admin') { return next(); }
    response.status(403).send({
      success: false,
      status: 403,
      error: {
        message: 'You are Forbidden.'
      },
    });
  });
};

export const authorizeUser = (req, res, next) => {
  const decode = verifyToken(req, res, next);

  const pool = new Pool({
    connectionString,
    ssl: true,
  });
  const queryValues = [];
  queryValues.push(decode.sub);
  pool.query('SELECT * FROM users WHERE id = $1', [queryValues[0]], (err, result) => {
    if (err) {
      throw err;
    }
    if (result.rows[0].role.length > 3) { return next(); }
    res.status(401).send({
      success: false,
      status: 401,
      error: {
        message: 'You are not authorized.',
      },
    });
  });
};
