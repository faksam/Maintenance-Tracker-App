import jwt from 'jwt-simple';
import dotenv from 'dotenv';
// import json file
import usersRequest from '../db/usersRequest.json';
import appConfig from '../config/config';

dotenv.config();

export const verifyToken = (req, res) => {
  let token;
  const error = {};
  error.message = {};
  let decode = '';
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') { 
    const authHeader = req.headers.authorization.split(' ');
    try {
      decode = jwt.decode(authHeader[1], appConfig.secret);
    } catch (err) {
      error.message = err;
    }
  } else if (req.query && req.query.token) {
    ({ token } = req.query);
    decode = jwt.decode(token, appConfig.secret);
  } else if (req.body && req.body.token) {
    ({ token } = req.body.token);
    decode = jwt.decode(token, appConfig.secret);
  }
  if (decode === '') {
    return res.status(400).send({
      success: false,
      status: 409,
      error
    });
  }
  if (decode !== null) { return decode; }

  return res.status(400).json({ error: 'Invalid User' });
};

export const verifyRequestInput = (req, res, next) => {
  const error = {};
  error.message = {};
  const {
    title, description
  } = req.body;
  let errorChecker = false;
  req.sanitizeBody('title').trim();
  req.sanitizeBody('description').trim();
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('description', 'Description is required').notEmpty();
  req.checkBody('title', 'Title is required').isString();
  req.checkBody('description', 'Description is required').isString();
  const errors = req.validationErrors();
  if (errors) {
    errors.forEach((value) => {
      error.message[value.param] = value.msg;
    });
    return res.status(400).send({
      success: false,
      status: 400,
      error,
    });
  }

  if (title.length < 10 || title.length > 60) {
    errorChecker = true;
    error.message.title = 'Title should be between 10 and 60 characters';
  }
  if (description.length < 100 || description.length > 500) {
    errorChecker = true;
    error.message.description = 'Description should be in details between 100 and 500 characters';
  }


  if (errorChecker) {
    return res.status(400).send({
      success: false,
      status: 400,
      error
    });
  }

  return next();
};

/**
 * Check if parameter is integer
 *
 * @param {*} n the id parameter passed with HTTP request
 * @returns {boolean} Is the parameter an integer
 */
function isInt(n) {
  return n === parseInt(n, 10);
}

export const verifyIfRequestExist = (req, res, next) => {
  const error = {};
  error.message = {};
  const requestId = parseInt(req.params.id, 10);
  let requestChecker = false;
  if (requestId < 0 || !isInt(requestId)) {
    // either age was not a valid number, integer, or is not in range
    error.message = 'id parameter must be a valid integer number';
    return res.status(400).send({
      success: false,
      status: 400,
      error
    });
  }
  usersRequest.requests.forEach((element) => {
    if (element.id === requestId) {
      requestChecker = true;
      return next();
    }
  });
  if (!requestChecker) {
    error.message = 'request id not found';
    res.status(404).send({
      success: false,
      status: 404,
      error
    });
  }
};
