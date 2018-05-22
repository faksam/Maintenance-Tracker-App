import { Pool, Client } from 'pg';
import { verifyToken } from '../helpers/validator';

const pool = new Pool();

export const authorizeAdmin = (req, response, next) => {
  let token;
  let decode;

  decode = verifyToken(req, res, next);

  pool.query('SELECT * FROM users WHERE id = $1', parseInt(decode.sub, 10), (err, res) => {
    if (err) {
      throw err
    }
  
    console.log('user:', res.rows[0]);
    if(res.rows[0].role === 'Admin') { return next(); }
    response.status(403).send({ error: 'You are Forbidden.' });
  });
};

export const authorizeUser = (req, res, next) => {
  let token;
  let decode;
  
  decode = verifyToken(req, res, next);
  
  pool.query('SELECT * FROM users WHERE id = $1', parseInt(decode.sub, 10), (err, res) => {
    if (err) {
      throw err
    }
  
    console.log('user:', res.rows[0]);
    if(res.rows[0].role.length > 3) { return next(); }
    response.status(403).send({ error: 'You are not authorized.' });
  });
};
