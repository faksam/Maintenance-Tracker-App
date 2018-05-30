import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import expressValidator from 'express-validator';
import dotenv from 'dotenv';

import apiv1 from './routes/v1/api1';

const app = express();
dotenv.config();

/**
 * @description - view engine setup
 */
app.set('views', path.join(__dirname, '../client'));
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');

/**
 * @description - Start server
 */
const PORT = process.env.PORT || 3456;
app.listen(PORT, () => {
  console.log(`The app is running on port ${PORT}`);
});

app.use(expressValidator());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client')));

/**
 * @description - Require static assets from template folder
 */
app.use('../client', express.static(path.join(`${__dirname}../client`)));

app.use('/api/v1/', apiv1);

/**
 * @description - catch 404 and forward to error handler
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @returns {object} returns res HTTP Response
 */
app.use((req, res) => {
  const error = {};
  error.message = 'Not Found';
  res.status(404).send({
    success: false,
    status: 404,
    message: 'Path Not Found',
    error,
  });
});

/**
 * @description - Error handler
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res HTTP Response
 */
app.use((err, req, res) => {
  if (err.status) { res.status(err.status); } else {
    res.status(500);
  }

  res.send({
    success: false,
    status: err.status,
    message: err.message,
    error: {
      message: err.message,
    },
  });
});

module.exports = app;
