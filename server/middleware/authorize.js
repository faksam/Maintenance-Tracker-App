import { Pool } from 'pg';
import { verifyToken } from '../helpers/validator';

const pool = new Pool();

export const authorizeAdmin = (req, response, next) => {
  const decode = verifyToken(req, response, next);

  pool.query('SELECT * FROM users WHERE id = $1', parseInt(decode.sub, 10), (err, result) => {
    if (err) {
      throw err;
    }

    if (result.rows[0].role === 'Admin') { return next(); }
    response.status(403).send({ error: 'You are Forbidden.' });
  });
};

export const authorizeUser = (req, res, next) => {
  const decode = verifyToken(req, res, next);

  pool.query('SELECT * FROM users WHERE id = $1', parseInt(decode.sub, 10), (err, result) => {
    if (err) {
      throw err;
    }

    if (result.rows[0].role.length > 3) { return next(); }
    res.status(403).send({ error: 'You are not authorized.' });
  });
};
