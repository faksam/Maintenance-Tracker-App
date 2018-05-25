import { Pool } from 'pg';
<<<<<<< HEAD
import dotenv from 'dotenv';
import jwt from 'jwt-simple';
import appConfig from '../config/config';
=======
import { verifyToken } from '../helpers/validator';
>>>>>>> parent of 7e4e83b... Merge pull request #26 from faksam/ft-admin-api-endpoints

const pool = new Pool();

export const authorizeAdmin = (req, response, next) => {
<<<<<<< HEAD
  let decode = '';
  const error = {};
  error.message = {};
  if (req.headers.authorization === undefined || req.headers.authorization === null || req.headers.authorization === '') {
    error.message = 'Token not valid';
    return response.status(400).send({
      success: false,
      status: 400,
      error
    });
  }
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    if (req.headers.authorization === undefined || req.headers.authorization === null || req.headers.authorization === '') {
      error.message = 'Token not valid';
      return response.status(400).send({
        success: false,
        status: 400,
        error
      });
    } else if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      const authHeader = req.headers.authorization.split(' ');
      try {
        decode = jwt.decode(authHeader[1], process.env.SECRET_TOKEN);
      } catch (err) {
        error.message = err;
      }
      if (decode === '') {
        error.message = 'Token not valid';
        return response.status(400).send({
          success: false,
          status: 400,
          error
        });
      }
    }
    const pool = new Pool({
      connectionString,
      ssl: true,
    });
    const queryValues = [];
    queryValues.push(decode.sub);
    pool.query('SELECT * FROM users WHERE id = $1', [queryValues[0]], (err, result) => {
      if (err) {
        return response.status(400).send({
          success: false,
          status: 400,
          error: {
            message: 'You are not authorized. You do not seem to be logged in, please login and try again.',
          },
        });
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
  }
};

export const authorizeUser = (req, res, next) => {
  const error = {};
  error.message = {};
  let decode = '';
  if (req.headers.authorization === undefined || req.headers.authorization === null || req.headers.authorization === '') {
    error.message = 'Token not valid';
    return res.status(400).send({
      success: false,
      status: 400,
      error
    });
  } else if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    const authHeader = req.headers.authorization.split(' ');
    try {
      decode = jwt.decode(authHeader[1], process.env.SECRET_TOKEN);
    } catch (err) {
      error.message = err;
    }
    if (decode === '') {
      error.message = 'Token not valid';
      return res.status(400).send({
        success: false,
        status: 400,
        error
      });
    }
  }
  const pool = new Pool({
    connectionString,
    ssl: true,
  });
  const queryValues = [];
  queryValues.push(decode.sub);
  pool.query('SELECT * FROM users WHERE id = $1', [queryValues[0]], (err, result) => {
=======
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
>>>>>>> parent of 7e4e83b... Merge pull request #26 from faksam/ft-admin-api-endpoints
    if (err) {
      return res.status(400).send({
        success: false,
        status: 400,
        error: {
          message: 'You are not authorized. You do not seem to be logged in, please login and try again.',
        },
      });
    }

    if (result.rows[0].role.length > 3) { return next(); }
    res.status(403).send({ error: 'You are not authorized.' });
  });
};
