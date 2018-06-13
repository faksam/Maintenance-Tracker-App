import express from 'express';
import indexRoute from './index';
import usersRoute from './users';
import adminRoute from './admin';
import authenticationRoute from './authentication';
import accountRoute from './account';

const app = express.Router();
indexRoute(app);
usersRoute(app);
adminRoute(app);
authenticationRoute(app);
accountRoute(app);


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

