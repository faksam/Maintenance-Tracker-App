import express from 'express';
import path from 'path';
import logger from 'morgan';
import expressValidator from 'express-validator';
import dotenv from 'dotenv';
import ejs from 'ejs';
import cors from 'cors';

import apiv1 from './routes/v1/';

dotenv.config();

const app = express();

/**
 * @description - view engine setup
 */
app.set('views', path.join(__dirname, '../../client'));
app.engine('html', ejs.renderFile);

app.set('view engine', 'html');

/**
 * @description - Start server
 */
const PORT = process.env.PORT || 3456;
app.listen(PORT, () => {
});

app.use(cors());
app.use(expressValidator());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * @description - Require static assets from template folder
 */
app.use(express.static(path.join(__dirname, '../../client')));

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
    error: {
      message: err.message,
    },
  });
});

export default app;
